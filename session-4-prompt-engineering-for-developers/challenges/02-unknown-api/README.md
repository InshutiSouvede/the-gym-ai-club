# Challenge 2: The Unknown API Challenge

## Overview

This challenge simulates a common developer scenario: working with an undocumented API. You'll practice using AI tools to understand the API structure and generate code to effectively process and utilize the data.

## Starting Code

```javascript
// You've discovered this API endpoint that returns data you need for your application
// Unfortunately, there's no documentation available, and you only have this sample response

// --- 1. TypeScript Interfaces ---

/**
 * Pagination metadata for API responses.
 */
export interface ApiPagination {
  page: number;
  per_page: number;
  total: number;
  pages: number;
}

/**
 * Meta information included in API responses.
 */
export interface ApiMeta {
  status: string;
  pagination: ApiPagination;
  request_id: string;
}

/**
 * Location details for events and meetings.
 */
export interface PhysicalLocation {
  venue: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface VirtualLocation {
  type: 'virtual';
  platform: string;
  url: string;
}

/**
 * Attributes for an Event item.
 */
export interface EventAttrs {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  location: PhysicalLocation;
  status: number;
  max_attendees: number;
  current_attendees: number;
  organizer_id: string;
  tags: string[];
}

/**
 * Attributes for a Meeting item.
 */
export interface MeetingAttrs {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number; // minutes
  location: VirtualLocation;
  recurring: boolean;
  frequency: string;
  status: number;
  organizer_id: string;
  team_id: string;
  tags: string[];
}

/**
 * Attributes for a Task item.
 */
export interface TaskAttrs {
  title: string;
  description: string;
  deadline: string; // ISO date string
  priority: number;
  status: number;
  assigned_to: string;
  project_id: string;
  tags: string[];
}

/**
 * Discriminated union for all possible item types.
 */
export type ApiItem =
  | {
      uid: string;
      type: 'event';
      created_at: string;
      modified_at: string;
      attrs: EventAttrs;
    }
  | {
      uid: string;
      type: 'meeting';
      created_at: string;
      modified_at: string;
      attrs: MeetingAttrs;
    }
  | {
      uid: string;
      type: 'task';
      created_at: string;
      modified_at: string;
      attrs: TaskAttrs;
    };

/**
 * The full API response structure.
 */
export interface ApiResponse {
  meta: ApiMeta;
  data: ApiItem[];
}

// --- 2. Utility Functions & Class ---

/**
 * Fetches a page of data from the API.
 * @param page The page number to fetch.
 * @param perPage Number of items per page.
 * @returns The API response.
 */
export async function fetchApiPage(
  page: number = 1,
  perPage: number = 10
): Promise<ApiResponse> {
  try {
    // Replace with your actual API endpoint
    const url = `https://api.example.com/items?page=${page}&per_page=${perPage}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data: ApiResponse = await response.json();
    return data;
  } catch (error) {
    // Error handling
    throw new Error(`Failed to fetch API data: ${(error as Error).message}`);
  }
}

/**
 * Fetches all pages of data from the API.
 * @param perPage Number of items per page.
 * @returns All items from all pages.
 */
export async function fetchAllApiItems(perPage: number = 10): Promise<ApiItem[]> {
  let page = 1;
  let allItems: ApiItem[] = [];
  let totalPages = 1;

  do {
    const response = await fetchApiPage(page, perPage);
    allItems = allItems.concat(response.data);
    totalPages = response.meta.pagination.pages;
    page++;
  } while (page <= totalPages);

  return allItems;
}

/**
 * Filters items by type.
 * @param items The array of items.
 * @param type The type to filter by ('event', 'meeting', 'task').
 */
export function filterByType(items: ApiItem[], type: ApiItem['type']): ApiItem[] {
  return items.filter(item => item.type === type);
}

/**
 * Searches items by keyword in title/name/description/tags.
 * @param items The array of items.
 * @param keyword The keyword to search for.
 */
export function searchItems(items: ApiItem[], keyword: string): ApiItem[] {
  const lower = keyword.toLowerCase();
  return items.filter(item => {
    if (item.type === 'event') {
      return (
        item.attrs.name.toLowerCase().includes(lower) ||
        item.attrs.tags.some(tag => tag.toLowerCase().includes(lower))
      );
    }
    if (item.type === 'meeting') {
      return (
        item.attrs.title.toLowerCase().includes(lower) ||
        item.attrs.tags.some(tag => tag.toLowerCase().includes(lower))
      );
    }
    if (item.type === 'task') {
      return (
        item.attrs.title.toLowerCase().includes(lower) ||
        item.attrs.description.toLowerCase().includes(lower) ||
        item.attrs.tags.some(tag => tag.toLowerCase().includes(lower))
      );
    }
    return false;
  });
}

// --- 3. Example Usage ---

async function exampleUsage() {
  try {
    // Fetch all items from the API (with pagination)
    const allItems = await fetchAllApiItems(10);

    // Filter for events only
    const events = filterByType(allItems, 'event');
    console.log('Events:', events);

    // Search for items with the keyword "team"
    const teamItems = searchItems(allItems, 'team');
    console.log('Items matching "team":', teamItems);
  } catch (error) {
    console.error('Error:', (error as Error).message);
  }
}

// Uncomment to run the example
// exampleUsage();

// You need to create a function that:
// 1. Fetches this data from the API
// 2. Processes it appropriately
// 3. Makes it usable in your application
// But you don't understand the data structure or fields fully
```

## The Problem

You need to work with an undocumented API that returns a complex data structure. The API appears to return information about different types of items (events, meetings, tasks), but you don't have clear documentation on:

- What all the fields mean
- What the status codes represent
- How to properly paginate through results
- How to filter or search for specific items
- How to handle the different item types

## Your Task

Use prompt engineering techniques to guide an AI coding assistant to:

1. Analyze and understand the API structure
2. Generate a comprehensive TypeScript interface for the API response
3. Create functions to fetch, process, and utilize this data
4. Implement proper pagination and error handling
5. Build a simple utility that can filter/search across the data

## Prompting Techniques to Practice

1. **Few-Shot Learning**: Provide examples of how you'd like to use the API data to guide the AI
2. **Constraint-Based Prompting**: Specify requirements and constraints clearly
3. **Incremental Understanding**: Break down the problem into smaller pieces
4. **Comparative Examples**: Use comparisons to clarify expected behavior

## Hints

- Start by asking the AI to analyze the structure and identify patterns
- Use the "thinking out loud" approach to understand the API design
- Ask for specific explanations of fields like "status" that aren't self-explanatory
- Provide examples of how you'd want to use the data in your application

## Success Criteria

Your solution should include:

- Well-documented TypeScript interfaces for all data structures
- A utility class or set of functions to work with the API
- Pagination handling for fetching multiple pages
- Error handling for API requests
- Functions to filter and search across items
- A simple example demonstrating usage

## Challenge Difficulty

⭐⭐⭐☆☆ (Intermediate)

Good luck!