import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed = 38, startDelay = 600) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);

    useEffect(() => {
        let i = 0;
        const t = setTimeout(() => {
        const iv = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) {
            clearInterval(iv);
            setDone(true);
            }
        }, speed);
        return () => clearInterval(iv);
        }, startDelay);

        return () => clearTimeout(t);
    }, [text, speed, startDelay]);

    return { displayed, done };
}