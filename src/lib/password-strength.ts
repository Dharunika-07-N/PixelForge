/**
 * Common Password List
 * 
 * Top 100 most common passwords used for strength validation
 * Source: SecLists / RockYou password database
 */

export const COMMON_PASSWORDS = [
    // Top 20 most common
    "password",
    "123456",
    "12345678",
    "1234",
    "qwerty",
    "12345",
    "dragon",
    "pussy",
    "baseball",
    "football",
    "letmein",
    "monkey",
    "696969",
    "abc123",
    "mustang",
    "michael",
    "shadow",
    "master",
    "jennifer",
    "111111",

    // Common variations
    "password123",
    "password1",
    "welcome",
    "welcome123",
    "admin",
    "admin123",
    "root",
    "toor",
    "pass",
    "test",
    "guest",
    "123456789",
    "1234567",
    "password!",
    "Password1",
    "Password123",

    // Sequential patterns
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
    "1qaz2wsx",
    "qazwsx",

    // Common words
    "sunshine",
    "princess",
    "starwars",
    "whatever",
    "iloveyou",
    "batman",
    "trustno1",
    "superman",
    "hello",
    "freedom",
    "computer",
    "internet",
    "login",
    "access",

    // Weak patterns
    "123123",
    "000000",
    "654321",
    "666666",
    "121212",
    "123321",
    "1234qwer",
    "qwer1234",
    "asdf1234",

    // Common names + numbers
    "jordan23",
    "robert",
    "matthew",
    "daniel",
    "jessica",
    "joshua",
    "ashley",
    "amanda",

    // Tech-related
    "android",
    "windows",
    "google",
    "facebook",
    "twitter",
    "linkedin",
    "github",

    // keyboard patterns
    "!@#$%^&*",
    "1q2w3e4r",
    "1q2w3e",
    "qwerty123",
    "abc12345",

    // Others
    "ninja",
    "azerty",
    "solo",
    "photoshop",

    // New additions (2020-2024)
    "pokemon",
    "covid19",
    "corona",
    "tiktok",
    "discord"
];

/**
 * Check if password is in common passwords list
 */
export function isCommonPassword(password: string): boolean {
    return COMMON_PASSWORDS.includes(password.toLowerCase());
}

/**
 * Calculate password strength score
 * Returns a score from 0 to 100
 */
export function calculatePasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
    suggestions: string[];
} {
    if (!password) {
        return {
            score: 0,
            label: "Weak",
            color: "red",
            suggestions: ["Use 8+ characters", "Add uppercase letters", "Add numbers"]
        };
    }

    let score = 0;
    const suggestions: string[] = [];

    // Length scoring
    if (password.length >= 8) {
        score += 20;
    } else {
        suggestions.push(`Use 8+ characters (currently ${password.length})`);
    }

    if (password.length >= 12) {
        score += 10;
    }

    if (password.length >= 16) {
        score += 5;
    }

    // Character variety
    if (/[a-z]/.test(password)) {
        score += 10;
    } else {
        suggestions.push("Add lowercase letters");
    }

    if (/[A-Z]/.test(password)) {
        score += 20;
    } else {
        suggestions.push("Add uppercase letters");
    }

    if (/[0-9]/.test(password)) {
        score += 20;
    } else {
        suggestions.push("Add numbers");
    }

    if (/[^a-zA-Z0-9]/.test(password)) {
        score += 20;
    } else {
        suggestions.push("Add special characters (!@#$%^&*)");
    }

    // Penalty for common passwords
    if (isCommonPassword(password)) {
        score = Math.min(score, 30);
        suggestions.unshift("⚠️ This password is too common and easily guessable");
    }

    // Penalty for sequential characters
    if (/(.)\1{2,}/.test(password)) {
        // Repeated characters (aaa, 111, etc.)
        score -= 10;
        suggestions.push("Avoid repeating characters");
    }

    if (/(?:abc|bcd|cdef|012|123|234|345)/i.test(password)) {
        // Sequential patterns
        score -= 10;
        suggestions.push("Avoid sequential patterns");
    }

    // Bonus for length
    if (password.length >= 20) {
        score += 5;
    }

    // Cap score
    score = Math.max(0, Math.min(100, score));

    // Determine label and color
    let label = "Weak";
    let color = "red";

    if (score >= 80) {
        label = "Very Strong";
        color = "green";
    } else if (score >= 60) {
        label = "Strong";
        color = "green";
    } else if (score >= 40) {
        label = "Medium";
        color = "yellow";
    } else if (score >= 20) {
        label = "Weak";
        color = "orange";
    }

    return { score, label, color, suggestions: suggestions.slice(0, 3) };
}
