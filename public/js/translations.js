// Load translations from JSON
fetch("translations.json")
    .then((response) => response.json())
    .then((translations) => {
        const languageSwitcher = document.getElementById("languageSwitcher");

        // Function to switch language
        const switchLanguage = (lang) => {
            // Save the selected language in localStorage
            localStorage.setItem("userLanguage", lang);

            // Get all translatable elements by their IDs
            for (const key in translations[lang]) {
                const element = document.getElementById(key);
                if (element) {
                    if (element.tagName === "INPUT") {
                        element.placeholder = translations[lang][key];
                    } else {
                        // For regular elements, update innerText
                        element.innerText = translations[lang][key];
                    }
                }
            }
        };

        // Check if the user has a saved language preference in localStorage
        const savedLanguage = localStorage.getItem("userLanguage");
        const defaultLanguage = savedLanguage
            ? savedLanguage
            : ["de", "hu"].includes(navigator.language.slice(0, 2))
                ? navigator.language.slice(0, 2)
                : "en";

        // Apply the saved or default language
        switchLanguage(defaultLanguage);

        // Set the dropdown value to match the selected language
        languageSwitcher.value = defaultLanguage;

        // Change language when user selects a different option
        languageSwitcher.addEventListener("change", (event) => {
            switchLanguage(event.target.value);
        });

        languageSwitcher.addEventListener("click", (event) => {
            switchLanguage(event.target.value);
        });
    })
    .catch((error) => console.error("Error loading translations:", error));
