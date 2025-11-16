import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

const Nutrition = () => {
  const [ingredients, setIngredients] = useState('');
  const [goals, setGoals] = useState('');
  const [diet, setDiet] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('saved-recipes') || '[]');
    } catch (e) {
      return [];
    }
  });

  // Helper to find nutrition data returned by server for a title
  const getNutritionFor = (title) => {
    if (!result || !result.nutrition) return null;
    const t = (title || '').toLowerCase();
    return result.nutrition.find(n => n.name && (t.includes(n.name.toLowerCase()) || n.name.toLowerCase().includes(t))) || null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const resp = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, goals, diet })
      });

      if (!resp.ok) {
        // Try to parse JSON error, otherwise read text
        let errMsg = `${resp.status} ${resp.statusText}`;
        try {
          const errJson = await resp.json();
          errMsg = errJson.message || JSON.stringify(errJson);
        } catch (parseErr) {
          try {
            const txt = await resp.text();
            if (txt) errMsg = txt;
          } catch (e) {
            // ignore
          }
        }
        throw new Error(errMsg || 'Failed to fetch');
      }

      // Parse successful JSON response (guard against empty body)
      let data = null;
      try {
        data = await resp.json();
      } catch (parseErr) {
        const txt = await resp.text().catch(() => '');
        console.warn('Nutrition response parse error, body:', txt);
        throw new Error('Invalid JSON response from server');
      }

      console.log('Nutrition API response:', data);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aura-dark">
      <Navbar />
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold gradient-text mb-4">Nutrition & Meal Suggestions</h1>
          <p className="text-gray-400 mb-6">Enter ingredients you have and get AI-generated dish ideas plus recipe links and nutrition info.</p>

          <Card className="mb-6">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Ingredients (comma separated)</label>
                <textarea value={ingredients} onChange={e => setIngredients(e.target.value)} rows={4} className="w-full mt-2 p-3 bg-gray-900 text-white rounded-lg" placeholder="eg. chicken, spinach, tomato, garlic" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Fitness Goals (optional)</label>
                  <input value={goals} onChange={e => setGoals(e.target.value)} className="w-full mt-2 p-3 bg-gray-900 text-white rounded-lg" placeholder="eg. weight loss, muscle gain, maintenance" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Dietary Preferences (optional)</label>
                  <input value={diet} onChange={e => setDiet(e.target.value)} className="w-full mt-2 p-3 bg-gray-900 text-white rounded-lg" placeholder="eg. vegetarian, keto, low-carb" />
                </div>
              </div>

              <div className="flex gap-3">
                <button disabled={loading} className="btn-primary">{loading ? 'Searching...' : 'Find Meals'}</button>
              </div>
            </form>
          </Card>

          {error && (
            <Card className="mb-4 bg-red-500/10 border-red-500/50">
              <div className="text-red-400">{error}</div>
            </Card>
          )}

          {result && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-xl font-semibold mb-3">AI suggested dishes</h2>
                {result.dishes && result.dishes.length ? (
                  <ol className="list-decimal list-inside space-y-2 text-gray-200">
                    {result.dishes.map((d, i) => (
                      <li key={i} className="font-medium">{d}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-400">No dishes generated.</p>
                )}
              </Card>

              <Card>
                <h2 className="text-xl font-semibold mb-3">Recipe search results (web)</h2>
                <p className="text-sm text-gray-400 mb-4">Top results from web search (Tavily). Click a result to open the full recipe.</p>

                {/* Search summary / answer if available */}
                {result.tavily?.answer && (
                  <div className="mb-4 p-4 bg-gray-900 rounded">
                    <strong className="text-gray-200">Summary:</strong>
                    <p className="text-gray-300 mt-2">{result.tavily.answer}</p>
                  </div>
                )}

                {/* Images (show first few thumbnails) */}
                {result.tavily?.images && result.tavily.images.length > 0 && (
                  <div className="flex gap-3 mb-4">
                    {result.tavily.images.slice(0,4).map((img, idx) => (
                      <img key={idx} src={img.url} alt={img.description || 'image'} className="w-24 h-24 object-cover rounded" />
                    ))}
                  </div>
                )}

                {/* Top result cards */}
                <div className="space-y-3">
                  {(result.tavily?.results || []).slice(0,5).map((r, i) => {
                    // Try to extract an image URL from rawContent markdown if present
                    const extractImage = (raw) => {
                      if (!raw) return null;
                      const m = raw.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i);
                      return m ? m[1] : null;
                    };

                    const thumb = r.image || extractImage(r.rawContent) || (result.tavily?.images && result.tavily.images[i] && result.tavily.images[i].url) || null;
                    const snippet = r.content || (r.rawContent ? r.rawContent.replace(/\n+/g, ' ').slice(0, 240) : '');
                    const isSaved = savedRecipes.find(s => s.url === r.url);

                    const save = () => {
                      try {
                        const next = [...savedRecipes, { title: r.title, url: r.url, snippet }];
                        setSavedRecipes(next);
                        localStorage.setItem('saved-recipes', JSON.stringify(next));
                        console.log('Saved recipe:', r.url);
                      } catch (e) {
                        console.error('Failed to save recipe', e);
                      }
                    };

                    return (
                      <div key={i} className="p-4 bg-gray-900 rounded hover:shadow-lg flex gap-4 items-start">
                        {thumb ? (
                          <img src={thumb} alt={r.title} className="w-28 h-20 object-cover rounded" />
                        ) : (
                          <div className="w-28 h-20 bg-gray-800 rounded flex items-center justify-center text-gray-500">No image</div>
                        )}

                        <div className="flex-1">
                          <a href={r.url} target="_blank" rel="noreferrer" className="text-lg font-semibold text-white hover:underline">{r.title}</a>
                          <p className="text-sm text-gray-400 mt-2">{snippet}</p>

                          {/* Nutrition block if available */}
                          {(() => {
                            const nut = getNutritionFor(r.title);
                            if (!nut) return null;
                            return (
                              <div className="mt-3 p-3 bg-gray-800 rounded text-sm text-gray-300">
                                <div className="flex gap-4">
                                  <div>Calories: <strong className="text-white">{nut.calories_kcal ?? nut.calories ?? '—'}</strong> kcal</div>
                                  <div>Protein: <strong className="text-white">{nut.protein_g ?? '—'}</strong> g</div>
                                  <div>Carbs: <strong className="text-white">{nut.carbs_g ?? '—'}</strong> g</div>
                                  <div>Fat: <strong className="text-white">{nut.fat_g ?? '—'}</strong> g</div>
                                </div>
                              </div>
                            );
                          })()}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <a href={r.url} target="_blank" rel="noreferrer" className="text-sm text-aura-blue hover:underline">Open recipe</a>
                              <button onClick={save} disabled={!!isSaved} className={`text-sm px-3 py-1 rounded ${isSaved ? 'bg-gray-700 text-gray-300 cursor-default' : 'bg-aura-purple text-white hover:opacity-90'}`}>
                                {isSaved ? 'Saved' : 'Save'}
                              </button>
                            </div>
                            <span className="text-xs text-gray-500">score: {typeof r.score === 'number' ? r.score.toFixed(2) : '—'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {(!result.tavily || (result.tavily.results || []).length === 0) && (
                    <p className="text-gray-400">No web results found.</p>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Nutrition;
