# FlowState Ops 🚦

### AI Event Congestion Decision Support System

FlowState Ops helps city authorities proactively manage **planned and unplanned traffic events** by forecasting congestion, recommending mitigation strategies, optimizing resource deployment, and learning from historical incidents.

---

## Problem Statement

Traffic congestion caused by:

* Sports events
* Political rallies
* Festivals
* Concerts
* Vehicle breakdowns
* Accidents
* Road closures

Current traffic management is largely reactive:

* Event impact is not quantified in advance
* Resource deployment is experience-driven
* No post-event learning system exists

---

## Solution

FlowState Ops transforms traffic management from:

```text
React → Congestion → Recovery
```

to

```text
Predict → Plan → Deploy → Learn
```

The platform:

* Predicts traffic impact before events occur
* Recommends manpower, barricades, and diversion plans
* Supports dynamic replanning during incidents
* Learns from previous events to improve future decisions

---

## Key Features

### Event Intelligence

Ingests:

* Planned events (matches, rallies, festivals)
* Unplanned events (accidents, breakdowns, road closures)

and automatically maps them onto the city network.

---

### Congestion Forecasting

Predicts:

* Congestion Score
* Expected Delay
* Affected Junctions
* Critical Congestion Windows

---

### Resource Planning

Generates deployment plans for:

* Traffic Police
* Barricades
* Tow Trucks
* Emergency Units

---

### AI Decision Support

Provides:

* Diversion recommendations
* Resource allocation plans
* Impact simulations
* Station-level instructions

---

### Post-Event Learning

Retrieves similar historical events and uses past outcomes to improve future recommendations.

---

## Architecture

```text
Events + Incidents + Traffic Data
                │
                ▼
      Feature Engineering
                │
                ▼
       ML Prediction Layer
                │
                ▼
     Recommendation Engine
                │
                ▼
          GenAI + RAG
                │
                ▼
      Operations Dashboard
```

---

## AI Components

### Machine Learning

Used for:

* Congestion Prediction
* Delay Forecasting
* Resource Estimation
* Hotspot Detection

### GenAI

Used to:

* Explain recommendations
* Generate operational summaries
* Assist traffic operators

### RAG

Used to:

* Retrieve similar historical events
* Compare previous outcomes
* Justify recommendations

---

## Dynamic Replanning

Example:

```text
IPL Match
      +
Vehicle Breakdown
      ↓
Recompute Forecast
      ↓
Generate New Diversions
      ↓
Update Station Instructions
```

FlowState Ops continuously adapts as new incidents occur.

---

## Tech Stack

**Frontend**

* HTML
* CSS
* JavaScript
* Chart.js

**Backend**

* Python
* FastAPI

**Machine Learning**

* LightGBM
* CatBoost
* Scikit-Learn

**RAG**

* FAISS
* Sentence Transformers

---

<img width="1763" height="844" alt="image" src="https://github.com/user-attachments/assets/0c02a044-8022-44d0-8a46-6001288f4340" />

Demo Link: https://htmlpreview.github.io/?https://github.com/WaniAnimesh/FlowState-Ops/blob/main/FlowState-Ops__Demo.html

## Vision

Build a continuously learning traffic operations platform that enables cities to anticipate congestion, optimize resources, and make faster, data-driven decisions.

**FlowState Ops: Predict. Plan. Deploy. Learn.** 🚦🏙️
