// React custom hook for Speech-to-Text using Web Speech API

function useSpeechRecognition({ onTranscript, onFinalResult }) {
    const [isListening, setIsListening] = React.useState(false);
    const [transcript, setTranscript] = React.useState("");
    const [isSupported, setIsSupported] = React.useState(true);
    const [speechError, setSpeechError] = React.useState(null);
    const recognitionRef = React.useRef(null);
    const finalTranscriptRef = React.useRef("");

    React.useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        try {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = "en-US";
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                setIsListening(true);
                setSpeechError(null);
                finalTranscriptRef.current = "";
            };

            recognition.onresult = (event) => {
                let interim = "";
                let final = "";

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    const text = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += text;
                    } else {
                        interim += text;
                    }
                }

                const currentCombined = (final || interim).trim();
                setTranscript(currentCombined);
                if (onTranscript) onTranscript(currentCombined);

                if (final && onFinalResult) {
                    finalTranscriptRef.current = final.trim();
                }
            };

            recognition.onerror = (event) => {
                console.warn("[Voice Hook Error]", event.error);
                if (event.error !== "no-speech") {
                    setSpeechError(event.error);
                }
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
                if (finalTranscriptRef.current && onFinalResult) {
                    onFinalResult(finalTranscriptRef.current);
                    finalTranscriptRef.current = "";
                }
            };

            recognitionRef.current = recognition;
        } catch (e) {
            console.error("SpeechRecognition initialization failed:", e);
            setIsSupported(false);
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch (_) {}
            }
        };
    }, []);

    const startListening = React.useCallback(() => {
        if (!recognitionRef.current) return;
        setTranscript("");
        finalTranscriptRef.current = "";
        try {
            recognitionRef.current.start();
        } catch (err) {
            if (err.name !== "InvalidStateError") {
                console.error("startListening error:", err);
            }
        }
    }, []);

    const stopListening = React.useCallback(() => {
        if (!recognitionRef.current) return;
        try {
            recognitionRef.current.stop();
        } catch (err) {
            console.warn("stopListening error:", err);
        }
    }, []);

    const toggleListening = React.useCallback(() => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    }, [isListening, startListening, stopListening]);

    return {
        isListening,
        transcript,
        isSupported,
        speechError,
        startListening,
        stopListening,
        toggleListening
    };
}

window.useSpeechRecognition = useSpeechRecognition;
