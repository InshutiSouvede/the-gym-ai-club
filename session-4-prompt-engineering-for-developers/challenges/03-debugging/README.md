# Challenge 3: The Debugging Mystery

## Overview

This challenge focuses on using AI to help identify and fix non-obvious bugs in a React application. You'll practice using different prompting techniques to effectively debug code that appears reasonable at first glance but contains several subtle issues.

## Starting Code

```jsx
// UserProfile.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Mock implementations (replace with real imports in actual app)
import { fetchUserData } from '../api/userService';
import UserStats from './UserStats';
import UserActivity from './UserActivity';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUserData(userId);
        if (isMounted) setUser(response);
      } catch (err) {
        if (isMounted) setError('Failed to load user profile');
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchUser();
    return () => { isMounted = false; };
  }, [userId]);

  function handleUpdateProfile(updatedData) {
    setUser(prevUser => prevUser ? { ...prevUser, ...updatedData } : prevUser);
  }

  if (error) return <div className="error-message" role="alert">{error}</div>;

  return (
    <div className="profile">
      {loading && <div className="loading-spinner" aria-live="polite">Loading...</div>}

      {!loading && user && (
        <>
          <header className="profile-header">
            <img
              src={user.avatarUrl}
              alt={user.name ? `${user.name}'s avatar` : 'User avatar'}
              className="avatar"
            />
            <h1>{user.name || 'User'}</h1>
            <p className="user-title">{user.jobTitle || 'No title'}</p>
          </header>

          <section className="profile-details">
            <p>{user.email || 'No email'}</p>
            <p>{user.location || 'No location'}</p>
            <p>
              Member since:{' '}
              {user.joinDate
                ? new Date(user.joinDate).toLocaleDateString()
                : 'Unknown'}
            </p>
          </section>

          <UserStats statistics={user.stats} />
          <UserActivity userId={userId} limit={5} />

          <button
            onClick={() => handleUpdateProfile({ status: 'active' })}
            className="status-button"
            aria-label="Set user status to active"
            type="button"
          >
            Set Active
          </button>
        </>
      )}
    </div>
  );
}

UserProfile.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

// UserStats.jsx
function UserStats({ statistics }) {
  if (!statistics) return null;
  return (
    <div className="user-stats">
      <h2>User Statistics</h2>
      <ul>
        <li>Posts: {statistics.posts}</li>
        <li>Comments: {statistics.comments}</li>
        <li>Likes received: {statistics.likesReceived}</li>
      </ul>
    </div>
  );
}
UserStats.propTypes = {
  statistics: PropTypes.shape({
    posts: PropTypes.number,
    comments: PropTypes.number,
    likesReceived: PropTypes.number,
  }),
};

// UserActivity.jsx
function UserActivity({ userId, limit }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let isMounted = true;
    setTimeout(() => {
      if (isMounted) {
        setActivities([
          { id: 1, type: 'post', content: 'Created a new post', date: '2023-05-15' },
          { id: 2, type: 'comment', content: 'Commented on a thread', date: '2023-05-14' }
        ]);
      }
    }, 500);
    return () => { isMounted = false; };
  }, [userId]);

  return (
    <div className="user-activity">
      <h2>Recent Activity</h2>
      <ul>
        {activities.slice(0, limit).map(activity => (
          <li key={activity.id}>
            {activity.content} - {activity.date}
          </li>
        ))}
      </ul>
    </div>
  );
}
UserActivity.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  limit: PropTypes.number,
};

// userService.js (API mock)
export async function fetchUserData(userId) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  if (userId === undefined) {
    throw new Error('userId is required');
  }
  return {
    id: userId,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    jobTitle: 'Senior Developer',
    location: 'San Francisco, CA',
    joinDate: '2021-03-15T00:00:00Z',
    avatarUrl: 'https://example.com/avatars/janesmith.png',
    status: 'inactive',
    stats: {
      posts: 42,
      comments: 156,
      likesReceived: 89
    }
  };
}
```

## The Problem

The React component above has several bugs that are causing performance issues, unexpected behavior, and potential errors. The component:

- Re-renders excessively
- May cause infinite API calls
- Has potential null reference errors
- Contains accessibility issues
- Has prop validation issues
- Includes inconsistent state management
- Contains other subtle bugs

A teammate has reported that the profile sometimes flickers and the app becomes sluggish when navigating to this page.

## Your Task

Use prompt engineering techniques to guide an AI coding assistant to:

1. Identify all the bugs in this component
2. Explain the root cause of each issue
3. Provide a fixed version of the code
4. Explain the reasoning behind each fix

## Prompting Techniques to Practice

1. **Role-Based Prompting**: Ask the AI to analyze the code as if it were an experienced React developer or performance optimization specialist
2. **Chain of Thought**: Guide the AI to think through the component lifecycle and execution flow
3. **Systematic Analysis**: Direct the AI to examine different aspects of the code (state management, effects, rendering, etc.)
4. **Diagnostic Prompting**: Ask targeted questions about specific parts of the code

## Hints

- Start by asking the AI to review the component for common React anti-patterns
- Focus on the `useEffect` hooks and their dependency arrays
- Look for potential state inconsistencies
- Consider how the component would behave with different prop values
- Think about the render cycle and when API calls are made

## Success Criteria

Your solution should:

- Identify at least 5 distinct bugs or issues in the code
- Provide clear explanations of why each issue is problematic
- Offer a fully fixed version of the component
- Include best practices for React development
- Ensure the component is performant and error-free

## Challenge Difficulty

⭐⭐⭐⭐☆ (Advanced)

Good luck!