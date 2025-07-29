async function loadData() {
  const res = await fetch('data.json');
  return res.json();
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // change to 'ar-SA' for Arabic
  speechSynthesis.speak(utterance);
}

function matchResponse(spokenText, data) {
  spokenText = spokenText.toLowerCase();
  for (let entry of data) {
    let matchCount = 0;
    for (let keyword of entry.keywords) {
      if (spokenText.includes(keyword)) {
        matchCount++;
      }
    }
    if (matchCount >= 2 || (entry.keywords.length === 1 && matchCount === 1)) {
      return entry.response;
    }
  }
  return "Sorry, I didn't understand that.";
}

function startListening() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();

  recognition.onresult = async function (event) {
    const spokenText = event.results[0][0].transcript;
    document.getElementById('spoken-text').textContent = spokenText;

    const data = await loadData();
    const response = matchResponse(spokenText, data);
    document.getElementById('response').textContent = response;
    speak(response);
  };

  recognition.onerror = function (event) {
    alert("Error: " + event.error);
  };
}