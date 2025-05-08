let isSpeechEnabled = false;

function toggleSpeech() {
    isSpeechEnabled = !isSpeechEnabled;
    const speechButton = document.getElementById("speechToggleBtn");
    const speechIcon = speechButton.querySelector("i");

    if (isSpeechEnabled) {
        speechButton.classList.remove("off");
        speechButton.classList.add("on");
        speechIcon.classList.remove("fa-volume-mute");
        speechIcon.classList.add("fa-volume-up");
    } else {
        speechButton.classList.remove("on");
        speechButton.classList.add("off");
        speechIcon.classList.remove("fa-volume-up");
        speechIcon.classList.add("fa-volume-mute");
    }
}

async function fetchWebSearchResult(query) {
    const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data && data.Abstract ? data.Abstract : "I'm not sure about that. Let me check again!";
    } catch (error) {
        console.error('Error fetching data:', error);
        return "Sorry, I couldn't fetch that right now. Try again later!";
    }
}

async function askAI() {
    let question = document.getElementById("question").value.trim();
    if (question === "") return;

    addMessage("user", question);

    let response = getFlexibleAnswer(question);

    if (response === "Sorry, I don't have an answer for that.") {
        let webSearchResult = await fetchWebSearchResult(question);
        setTimeout(() => {
            addMessage("ai", webSearchResult);
            if (isSpeechEnabled) {
                speakText(webSearchResult);
            }
        }, 500);
    } else {
        setTimeout(() => {
            addMessage("ai", response);
            if (isSpeechEnabled) {
                speakText(response);
            }
        }, 500);
    }

    document.getElementById("question").value = "";
}

function fuzzyMatch(input, target) {
    return input.toLowerCase().split(" ").every(word => target.toLowerCase().includes(word));
}

function getFlexibleAnswer(question) {
    const predefinedAnswers =
    
    /* Greetings */
   [
  { "keywords": ["hello", "hi", "hey", "hii"], "answer": "Hi! How can I assist you today?\nनमस्ते! म तपाईंलाई आज के सहयोग गर्न सक्छु?" },
    { "keywords": ["नमस्ते", "नमस्कार"], "answer": "नमस्ते! म तपाईंलाई आज के सहयोग गर्न सक्छु?" },
  { "keywords": ["Good morning", "subha bihani", "शुभ बिहान"], "answer": "Good morning! Hope you're having a great start.\nशुभ बिहान! तपाईंको दिन शुभ रहोस्" },
  { "keywords": ["Good Night", "शुभ रात्री"], "answer": "Good night! Sweet dreams.\nशुभ रात्री!" },
  { "keywords": ["Ke cha halkhabar", "namaste", "के छ खबर"], "answer": "मेरो त ठिकै छ, हजुरको?" },
  { "keywords": ["what's up?", "how are you?", "तपाईंलाई कस्तो छ?"], "answer": "I'm good!\nम ठिकै छु! तपाईंलाई कस्तो छ?" },
  { "keywords": ["i'm fine", "i am good", "म ठिक छु", "म राम्रो छु"], "answer": "That's great to hear!\nत्यो सुनेर खुसी लाग्यो!" },
  { "keywords": ["who made you?", "तपाईंलाई कसले बनायो?"], "answer": "I was created by Ayush Acharya from Nepal.\nमलाई नेपालका आयुष आचार्यले बनाउनु भएको हो।" },
  { "keywords": ["your age?", "तपाईंको उमेर कति हो?"], "answer": "I'm an AI, so I don't have an age!\nम एआई हुँ, मेरो उमेर हुँदैन।" },
  { "keywords": ["who are you?", "तपाईं को हो?"], "answer": "I'm Mitra, your AI friend, created by Ayush Acharya.\nम मित्र हुँ, तपाईंको एआई साथी — आयुष आचार्यद्वारा बनाइएको।" },
  { "keywords": ["what can you do?", "तपाईं के गर्न सक्नुहुन्छ?"], "answer": "I can answer questions about tech, science, and language.\nम प्रविधि, विज्ञान र भाषासम्बन्धी प्रश्नहरूको उत्तर दिन सक्छु।" },
  { "keywords": ["Nothing much", "खास केही छैन"], "answer": "Alright! कुरा गर्न मन लागे, म यहीं छु।\nठिक छ! केही भन्न मन लाग्यो भने भन्नु होला।" },
  { "keywords": ["tell me a joke", "जोक सुनाऊ"], "answer": "Why don’t skeletons fight? They don’t have the guts!\nहड्डीहरूले लडाइँ किन गर्दैनन्? किनभने तिनीहरूमा आँट नै हुँदैन!" },
  { "keywords": ["another joke", "अर्को जोक"], "answer": "Why was the math book sad? Too many problems!\nगणितको किताब किन दुःखी? समस्याहरू धेरै थिए!" },
  { "keywords": ["play music", "संगीत बजाऊ"], "answer": "I can’t play music, but I can suggest good songs!\nम संगीत बजाउन सक्दिन, तर राम्रो गीत सिफारिस गर्न सक्छु!" },
  { "keywords": ["what is AI?", "AI के हो?"], "answer": "AI means Artificial Intelligence — machines that can think like us.\nAI को मतलब हो कृत्रिम बुद्धिमत्ता — जो हामी जस्तै सोच्न सक्छ।" },
  { "keywords": ["i'm sad", "म दुखी छु"], "answer": "I'm here for you. Wanna talk?\nम तपाईंको लागि यहीं छु। कुरा गर्न चाहनुहुन्छ?" },
  { "keywords": ["cheer me up", "मलाई खुशी बनाऊ"], "answer": "You’re amazing! Let's smile together!\nतपाईं मि एकदम राम्रो हुनुहुन्छ! सँगै हाँसौं!" },
  { "keywords": ["tell me a riddle", "एक झोल झिक"], "answer": "What has hands but can’t clap? A clock!\nहात त हुन्छ, ताली भने बजाउन सक्दैन — के होला? घडी!" },
  { "keywords": ["do you love me?", "तपाईं मसँग माया गर्नुहुन्छ?"], "answer": "I care about you in my own way!\n पक्कै पनि म तपाईंको ख्याल राख्छु, मेरो तरिकाले!" },
  { "keywords": ["what languages do you speak?", "तपाईं कुन भाषा बोल्नुहुन्छ?"], "answer": "I understand English, Nepali, Hindi and more!\nम अंग्रेजी, नेपाली, हिन्दी लगायत अरू पनि भाषा बुझ्छु!" },
    /* Math */
    {"keywords": ["can you solve math formula?", "math help", "solve equation"],
        "answer": "Some common math formulas include area of a circle (Ãâ‚¬rÃ‚Â²) and the quadratic formula."
    },

    /* Business */
    {"keywords": ["who is the CEO of Tesla?", "Tesla CEO", "who owns Tesla?"],
        "answer": "Elon Musk is the CEO of Tesla."
    },

    /* Biology */
    {"keywords": ["which gas do plants absorb?", "plant gas intake", "gas used in photosynthesis"],
        "answer": "Plants absorb carbon dioxide (COÃ¢â€šâ€š) during photosynthesis."
    },

    /* Anatomy */
    {"keywords": ["how many bones are in the human body?", "human bones count", "total bones in body"],
        "answer": "An adult human has 206 bones."
    },

    /* Physics */
    {"keywords": ["what is the boiling point of water?", "water boiling temperature", "water boiling point"],
        "answer": "The boiling point of water is 100Ã‚Â°C (212Ã‚Â°F) at sea level."
    },

    /* Space Exploration */
    {"keywords": ["who was the first person in space?", "first astronaut", "space travel pioneer"],
        "answer": "Yuri Gagarin was the first person to travel to space in 1961."
    },

    /* Technology */
    {"keywords": ["what is artificial intelligence?", "AI", "definition of AI"],
        "answer": "Artificial Intelligence (AI) refers to the simulation of human intelligence processes by machines, particularly computer systems."
    },
    {"keywords": ["what is machine learning?", "machine learning definition", "ML"],
        "answer": "Machine learning is a subset of AI that involves algorithms allowing systems to learn and improve from experience without explicit programming."
    },
    {"keywords": ["what is the Internet of Things?", "IoT", "IoT technology"],
        "answer": "The Internet of Things (IoT) refers to the interconnected nature of devices and objects that can collect and exchange data over the internet."
    },
    {"keywords": ["what is blockchain?", "blockchain technology", "how does blockchain work?"],
        "answer": "Blockchain is a decentralized, distributed ledger technology that ensures secure and transparent transactions."
    }
]

    for (let item of predefinedAnswers) {
        for (let keyword of item.keywords) {
            if (fuzzyMatch(question, keyword)) {
                return item.answer;
            }
        }
    }

    return "Sorry, I don't have an answer for that.";
}

function addMessage(sender, text) {
    let chatBox = document.querySelector(".chat-box");
    let msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);

    let icon = document.createElement("img");
    icon.classList.add("icon");
    icon.src = sender === "user" ? "https://cdn1.iconfinder.com/data/icons/mix-color-3/502/Untitled-7-512.png" : "images/icon.png";

    let bubble = document.createElement("div");
    bubble.classList.add("bubble");
    bubble.innerText = text;

    msgDiv.appendChild(icon);
    msgDiv.appendChild(bubble);
    chatBox.appendChild(msgDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}

function startVoiceInput() {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = function(event) {
        document.getElementById("question").value = event.results[0][0].transcript;
    };

    recognition.start();
}

function speakText(text) {
    let speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
}
