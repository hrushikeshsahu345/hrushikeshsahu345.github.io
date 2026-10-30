// =====================================================
// NAVIGATION
// =====================================================

const tabs = document.querySelectorAll(".main-nav a");

function showTab(id) {

    tabs.forEach(tab => {
        tab.classList.toggle(
            "active",
            tab.dataset.tab === id
        );
    });

    document.querySelectorAll(".panel").forEach(panel => {
        panel.classList.toggle(
            "active",
            panel.id === id
        );
    });

    window.scrollTo(0, 0);
}


// Navigation links
tabs.forEach(tab => {

    tab.addEventListener("click", event => {

        event.preventDefault();

        const id = tab.dataset.tab;

        history.replaceState(
            null,
            "",
            "#" + id
        );

        showTab(id);
    });

});


// =====================================================
// MEDICAL STORE CARD
// =====================================================

const storeGrid =
    document.getElementById("medical-store-grid");


storeGrid.innerHTML = `
    <article class="card store-card" id="pharma-sales-card">

        <h3>Pharma Sales</h3>

        <p class="dist">
            Medicine Demand Forecasting
        </p>

        <p class="addr">
            Open forecasting dashboard →
        </p>

    </article>
`;


// Click Pharma Sales
document
    .getElementById("pharma-sales-card")
    .addEventListener("click", () => {

        history.replaceState(
            null,
            "",
            "#pharma-sales"
        );

        showTab("pharma-sales");
    });


// Back button
document
    .getElementById("back-to-stores")
    .addEventListener("click", () => {

        history.replaceState(
            null,
            "",
            "#medical-stores"
        );

        showTab("medical-stores");
    });


// =====================================================
// INITIAL PAGE
// =====================================================

const initialPage =
    location.hash.slice(1) || "peakai";

showTab(initialPage);


// =====================================================
// PEAKAI
// =====================================================

const log =
    document.getElementById("chat-log");

const form =
    document.getElementById("chat-form");

const input =
    document.getElementById("chat-input");


function addMessage(text, who) {

    const message =
        document.createElement("div");

    message.className =
        "msg " + who;

    message.textContent = text;

    log.appendChild(message);

    log.scrollTop =
        log.scrollHeight;
}


function reply(question) {

    question =
        question.toLowerCase();

    if (
        question.includes("forecast") ||
        question.includes("predict") ||
        question.includes("demand")
    ) {

        return "Open Medical Stores → Pharma Sales to forecast medicine demand.";
    }

    if (
        question.includes("stock") ||
        question.includes("medicine")
    ) {

        return "You can use the Pharma Sales dashboard to forecast medicine demand.";
    }

    return "I can help you forecast medicine demand. Try asking about demand or stock.";
}


addMessage(
    "Hi, I'm PeakAI. I can help you with medicine demand forecasting.",
    "bot"
);


form.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const question =
            input.value.trim();

        if (!question)
            return;

        addMessage(
            question,
            "user"
        );

        input.value = "";

        setTimeout(() => {

            addMessage(
                reply(question),
                "bot"
            );

        }, 500);

    }
);


// =====================================================
// FORECAST API
// =====================================================

const API_URL =
    "http://127.0.0.1:8000";


const forecastButton =
    document.getElementById("forecast-button");

const medicineSelect =
    document.getElementById("medicine-select");

const forecastDays =
    document.getElementById("forecast-days");

const forecastBody =
    document.getElementById("forecast-body");

const forecastStatus =
    document.getElementById("forecast-status");


// =====================================================
// PREDICT DEMAND
// =====================================================

forecastButton.addEventListener(
    "click",
    async () => {

        const medicine =
            medicineSelect.value;

        const days =
            Number(forecastDays.value);


        forecastButton.disabled = true;

        forecastButton.textContent =
            "Predicting...";


        forecastStatus.textContent =
            "Running demand forecasting model...";


        forecastBody.innerHTML = "";


        try {

            const response =
                await fetch(
                    `${API_URL}/forecast`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            medicine: medicine,
                            days: days
                        })
                    }
                );


            if (!response.ok) {

                const error =
                    await response.json();

                throw new Error(
                    error.detail ||
                    "Forecast failed"
                );
            }


            const result =
                await response.json();


            forecastStatus.textContent =
                `Forecast generated for ${result.medicine}`;


            result.forecast.forEach(item => {

                const row =
                    document.createElement("tr");

                row.innerHTML = `
                    <td>${item.date}</td>
                    <td>${item.predicted_demand}</td>
                `;

                forecastBody.appendChild(row);

            });

        }

        catch (error) {

            console.error(error);

            forecastStatus.textContent =
                "Error: " + error.message;

        }

        finally {

            forecastButton.disabled = false;

            forecastButton.textContent =
                "Predict Demand";

        }

    }
);
