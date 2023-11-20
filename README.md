# Moodo

Moodo is a mental health web app that enables users to track and manage their moods, promoting a better understanding of their emotional well-being over time. This app is built using React with React Router for the frontend and Firebase for the backend. The following README provides an overview of the app, its features, and instructions for installation and usage.

## Technologies Used:

- Moodo utilizes React for its component-based architecture and React Router enables navigation and routing within the app.
- It uses Firebase for its various backend services, including authentication and database functionalities.
- Incorporates Google Sign-In functionality to allow users to authenticate with their Google accounts.
- Utlizes OpenAi Api to make calls once a day per mood type to generate fresh content for mood tips.
- Uses Chakra UI and Bootstrap(for responsive navigation) to create consistent UI components.
- Integrates Framer Motion to add fluid and engaging animations.
- Adds Google chart to incorporate graph to visualize mood history and statistics.
- Integrates the API Ninja to fetch and display inspirational quotes every 30 seconds.
- Uses ViTest and React Testing Library for testing various components.

## Installation

Follow these steps to install Moodo on your loval machine:

Clone the repository: git clone https://github.com/Munsat/Moodo

Navigate to the project directory:

```
cd moodo
```

Install dependencies:

```
npm install
```

Run the app:

```
npm run dev
```

Open the app on your local machine.

---

## Features

**Mood Trackers** : Log your daily moods using a simple and intuitive interface. Select from a range of emotions to reflect your state of mind.Add notes to your mood entries, providing context and allowing you to record any significant events or experiences that may have influenced your mood.

**Mood History**: View a visual representation of your mood history through graph. Identify patterns and trends in your emotional well-being over time.

**Mood Tips**: Access helpful tips and resources to improve your mood and overall well-being. Get suggestions based on your current mood or specific emotions.

**Guided Meditation**: Practice guided meditation sessions tailored to your mood. Choose from a variety of meditation exercises to relax and find inner peace.

**Breathing Exercise with Animation**: Engage in deep breathing exercises accompanied by calming animations. Promote relaxation and reduce stress.

**Community Support**: Connect with a supportive community of users. Share experiences, provide encouragement, and seek advice from others on their mood journeys.

**Inspirational Quotes**: Receive inspirational quotes to uplift your mood and provide motivation for positive thinking.

**Journal**: Keep a digital journal to record your thoughts, experiences, and reflections. Capture important moments and track your personal growth.

---

### User Stories:

- As a user, I want to be able to track and log my daily moods, allowing me to have a better understanding of my emotional well-being over time.
- As a user, I want to receive personalized mood tips and suggestions to improve my mood and overall mental well-being.
- As a user, I want to have access to a collection of guided meditation sessions to help me relax and reduce stress.
- As a user, I want to be able to record my thoughts and feelings in a digital journal, providing me with an outlet for self-expression and reflection.
- As a user, I want to be inspired and motivated by constant new quotes that uplift my spirits and provide a positive outlook.
- As a user, I want to connect with a supportive community of individuals who are also focused on improving their mental health and well-being, and like and comment on their post to engage.
- As a user, I want to visualize my mood history, enabling me to identify trends and patterns in my emotional states.
- As a user, I want the application to be responsive and accessible across different devices, allowing me to access Moodo on my preferred platform.
- As a user, I want the option to sign in with my Google account for seamless and secure authentication.
- As a user, I want a user-friendly and intuitive interface that makes it easy to navigate and interact with the app's features.

---

## Usage

Once you have Moodo up and running, follow these instructions to start tracking your moods:

1. Create an account: Sign up for a new account or log in with your existing credentials.
1. Log your mood: Use the mood tracker to select and log your current mood.Add notes to provide context to your mood entry.
1. View mood history: Explore your mood history by navigating to the graph section. Use the provided graph and mood entries to gain insights into your emotional well-being.
1. Get mood tips: Access the Mood Tips section to receive helpful tips and resources tailored to your current mood or specific emotions.
1. Practice guided meditation: Engage in guided meditation sessions by selecting from various exercises based on your mood. Follow the provided instructions to relax and find inner peace.
1. Try breathing exercises: Explore the Breathing Exercise section and follow the animated instructions to practice deep breathing. Reduce stress and promote relaxation.
1. Connect with the community: Join the Community Support section to engage with other users. Share experiences, provide support, and seek advice on your mood journey.
1. Find inspiration: Receive inspirational quotes to uplift your mood and promote positive thinking.

---

### Run Tests

```
npm run test

```

---

### Major Hurdles:

- Learning Firebase: Incorporating Firebase into the project required learning a new technology stack.However, through thorough documentation study, online resources, and experimentation, I was able to grasp the fundamentals of Firebase and successfully integrate it into the app.

- Testing Challenges: Testing a complex application like Moodo was quite challenging, especially when dealing with asynchronous operations and real-time updates. Ensuring the correct behavior of components, data fetching, and state management posed some difficulties.

## Resources:

Guided Medication Audio:
https://www.freemindfulness.org/

## Deployed Version

https://mentalhealthapp-28d99.web.app/
