const input = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const counter = document.getElementById('counter');
const errorMsg = document.getElementById('errorMsg');
const resultPanel = document.getElementById('resultPanel');

const HUMAN_SAMPLE = `Last Saturday I woke up later than I planned, made coffee, and walked to the little market near my apartment. I forgot my shopping list, so I bought tomatoes, bread, and way too many oranges. On the way home it started raining, and I ended up sharing the building entrance with a neighbor I had never met before.`;
const AI_SAMPLE = `Artificial intelligence is transforming modern society by improving efficiency, automating repetitive processes, and supporting data-driven decision making. Across industries, AI systems can analyze large volumes of information, identify patterns, and generate useful insights. As adoption continues to grow, organizations should also consider transparency, fairness, privacy, and responsible deployment.`;

function updateCount(){
  const words = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;
  counter.textContent = `${words} word${words === 1 ? '' : 's'}`;
}
input.addEventListener('input', updateCount);

document.getElementById('sampleHuman').onclick = () => { input.value = HUMAN_SAMPLE; updateCount(); errorMsg.textContent=''; };
document.getElementById('sampleAI').onclick = () => { input.value = AI_SAMPLE; updateCount(); errorMsg.textContent=''; };

function renderResult(data){
  const isAI = data.prediction === 1;
  resultPanel.classList.remove('idle','ai','human');
  resultPanel.classList.add(isAI ? 'ai' : 'human');
  document.getElementById('resultIcon').textContent = isAI ? '✦' : '✓';
  document.getElementById('resultLabel').textContent = data.label;
  document.getElementById('resultDescription').textContent = isAI
    ? 'The model found patterns that are more consistent with AI-generated writing.'
    : 'The model found patterns that are more consistent with human-written text.';
  const pct = Math.round(data.confidence * 1000) / 10;
  document.getElementById('confidenceValue').textContent = `${pct}%`;
  document.getElementById('confidenceBar').style.width = `${pct}%`;
  document.getElementById('humanProb').textContent = `${(data.human_probability*100).toFixed(1)}%`;
  document.getElementById('aiProb').textContent = `${(data.ai_probability*100).toFixed(1)}%`;
}

analyzeBtn.onclick = async () => {
  const text = input.value.trim();
  errorMsg.textContent = '';
  if(text.length < 20){ errorMsg.textContent = 'Please enter at least 20 characters.'; return; }
  analyzeBtn.disabled = true;
  try{
    const response = await fetch('/predict', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({text})
    });
    const data = await response.json();
    if(!response.ok) throw new Error(data.detail || 'Prediction failed.');
    renderResult(data);
  }catch(err){
    errorMsg.textContent = err.message;
  }finally{
    analyzeBtn.disabled = false;
  }
};
