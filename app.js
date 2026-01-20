const RecipeApp = (() => {

    console.log("RecipeApp initializing...");

    // =======================
    // 1. Recipe Data (Enhanced)
    // =======================

    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
            category: "pasta",
            ingredients: ["Spaghetti", "Eggs", "Parmesan", "Pancetta", "Black pepper"],
            steps: [
                "Boil water",
                "Cook spaghetti",
                {
                    text: "Prepare sauce",
                    substeps: [
                        "Beat eggs",
                        "Grate cheese",
                        {
                            text: "Mix eggs and cheese",
                            substeps: ["Whisk well", "Set aside"]
                        }
                    ]
                },
                "Combine pasta and sauce",
                "Serve hot"
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
            category: "curry",
            ingredients: ["Chicken", "Tomatoes", "Cream", "Spices", "Onion"],
            steps: [
                "Marinate chicken",
                "Grill chicken",
                {
                    text: "Prepare gravy",
                    substeps: ["Heat oil", "Add spices", "Add tomatoes", "Simmer"]
                },
                "Add chicken to gravy",
                "Cook and serve"
            ]
        },

        // 👉 For remaining recipes (3–8), add simple steps & ingredients:
        // You can keep steps as simple strings if no nesting is needed

        {
            id: 3,
            title: "Homemade Croissants",
            time: 180,
            difficulty: "hard",
            description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
            category: "baking",
            ingredients: ["Flour", "Butter", "Yeast", "Milk", "Sugar"],
            steps: ["Prepare dough", "Fold butter", "Rest dough", "Shape croissants", "Bake"]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
            category: "salad",
            ingredients: ["Tomato", "Cucumber", "Feta", "Olives", "Olive oil"],
            steps: ["Chop vegetables", "Add cheese", "Mix dressing", "Toss and serve"]
        },
        {
            id: 5,
            title: "Beef Wellington",
            time: 120,
            difficulty: "hard",
            description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
            category: "meat",
            ingredients: ["Beef", "Mushrooms", "Pastry", "Mustard"],
            steps: ["Sear beef", "Prepare mushrooms", "Wrap beef", "Bake"]
        },
        {
            id: 6,
            title: "Vegetable Stir Fry",
            time: 20,
            difficulty: "easy",
            description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
            category: "vegetarian",
            ingredients: ["Broccoli", "Carrot", "Capsicum", "Soy sauce"],
            steps: ["Chop vegetables", "Heat pan", "Stir fry veggies", "Add sauce", "Serve"]
        },
        {
            id: 7,
            title: "Pad Thai",
            time: 30,
            difficulty: "medium",
            description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
            category: "noodles",
            ingredients: ["Noodles", "Shrimp", "Peanuts", "Tamarind"],
            steps: ["Soak noodles", "Cook shrimp", "Add sauce", "Mix noodles", "Garnish"]
        },
        {
            id: 8,
            title: "Margherita Pizza",
            time: 60,
            difficulty: "medium",
            description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
            category: "pizza",
            ingredients: ["Flour", "Tomato sauce", "Mozzarella", "Basil"],
            steps: ["Prepare dough", "Spread sauce", "Add cheese", "Bake", "Add basil"]
        }
    ];

    // =======================
    // 2. DOM Selection & State
    // =======================

    const recipeContainer = document.querySelector('#recipe-container');

    let currentFilter = "ALL";
    let currentSort = "NONE";

    // =======================
    // 3. Recursion: Render Steps
    // =======================

    const renderSteps = (steps, level = 0) => {
        return steps.map(step => {
            if (typeof step === "string") {
                return `<li class="step level-${level}">${step}</li>`;
            }

            return `
                <li class="step level-${level}">
                    ${step.text}
                    <ul>
                        ${renderSteps(step.substeps, level + 1)}
                    </ul>
                </li>
            `;
        }).join('');
    };

    // =======================
    // 4. Create Recipe Card
    // =======================

    const createRecipeCard = (recipe) => {
        return `
            <div class="recipe-card" data-recipe-id="${recipe.id}">
                <h3>${recipe.title}</h3>

                <div class="recipe-meta">
                    <span>⏱️ ${recipe.time} min</span>
                    <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
                </div>

                <p>${recipe.description}</p>

                <div class="recipe-actions">
                    <button class="toggle-btn" data-toggle="steps">Show Steps</button>
                    <button class="toggle-btn" data-toggle="ingredients">Show Ingredients</button>
                </div>

                <div class="steps-container" data-type="steps">
                    <ol>
                        ${renderSteps(recipe.steps)}
                    </ol>
                </div>

                <div class="ingredients-container" data-type="ingredients">
                    <ul>
                        ${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    };

    // =======================
    // 5. Render Recipes
    // =======================

    const renderRecipes = (recipesToRender) => {
        const recipeCardsHTML = recipesToRender
            .map(createRecipeCard)
            .join('');

        recipeContainer.innerHTML = recipeCardsHTML;
    };

    // =======================
    // 6. Filter & Sort (From Part 2)
    // =======================

    const filterRecipes = (recipes, filterType) => {
        switch (filterType) {
            case "EASY":
                return recipes.filter(r => r.difficulty === "easy");
            case "MEDIUM":
                return recipes.filter(r => r.difficulty === "medium");
            case "HARD":
                return recipes.filter(r => r.difficulty === "hard");
            case "QUICK":
                return recipes.filter(r => r.time < 30);
            case "ALL":
            default:
                return [...recipes];
        }
    };

    const sortRecipes = (recipes, sortType) => {
        const copy = [...recipes];

        switch (sortType) {
            case "NAME":
                return copy.sort((a, b) => a.title.localeCompare(b.title));
            case "TIME":
                return copy.sort((a, b) => a.time - b.time);
            default:
                return copy;
        }
    };

    const updateDisplay = () => {
        const filtered = filterRecipes(recipes, currentFilter);
        const sorted = sortRecipes(filtered, currentSort);
        renderRecipes(sorted);
    };

    // =======================
    // 7. Toggle Handling (Event Delegation)
    // =======================

    const handleToggleClick = (e) => {
        const button = e.target;

        if (!button.classList.contains("toggle-btn")) return;

        const card = button.closest(".recipe-card");
        const toggleType = button.dataset.toggle; // steps or ingredients

        const container = card.querySelector(`.${toggleType}-container`);

        container.classList.toggle("visible");

        if (container.classList.contains("visible")) {
            button.textContent = `Hide ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`;
        } else {
            button.textContent = `Show ${toggleType.charAt(0).toUpperCase() + toggleType.slice(1)}`;
        }
    };

    const setupEventListeners = () => {
        recipeContainer.addEventListener("click", handleToggleClick);
        console.log("Event listeners attached!");
    };

    // =======================
    // 8. Public Filter/Sort API
    // =======================

    const setFilter = (filterType) => {
        currentFilter = filterType;
        updateDisplay();
    };

    const setSort = (sortType) => {
        currentSort = sortType;
        updateDisplay();
    };

    // =======================
    // 9. Init
    // =======================

    const init = () => {
        updateDisplay();
        setupEventListeners();
        console.log("RecipeApp ready!");
    };

    // Public API
    return {
        init,
        updateDisplay,
        setFilter,
        setSort
    };

})();

// Start app
RecipeApp.init();
