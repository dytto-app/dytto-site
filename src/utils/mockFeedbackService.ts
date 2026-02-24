// Mock feedback service for development when Supabase is not configured
export interface FeedbackItem {
  id: string;
  title: string;
  body?: string;
  category: 'bug' | 'idea' | 'ux';
  upvotes: number;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  created_at: string;
  user_has_voted: boolean;
}

export interface FeedbackSubmission {
  title: string;
  body: string;
  category: 'bug' | 'idea' | 'ux';
}

// Mock data
const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    title: 'Add dark mode toggle in settings',
    body: 'It would be great to have a dark mode option in the app settings for better viewing in low light conditions.',
    category: 'idea',
    upvotes: 15,
    status: 'in_progress',
    created_at: '2024-01-15T10:30:00Z',
    user_has_voted: false
  },
  {
    id: '2',
    title: 'App crashes when uploading large photos',
    body: 'The app consistently crashes when I try to upload photos larger than 10MB. This happens on both iOS and Android.',
    category: 'bug',
    upvotes: 23,
    status: 'open',
    created_at: '2024-01-14T15:45:00Z',
    user_has_voted: true
  },
  {
    id: '3',
    title: 'Improve story generation speed',
    body: 'Story generation takes too long, sometimes up to 30 seconds. Could this be optimized?',
    category: 'ux',
    upvotes: 8,
    status: 'completed',
    created_at: '2024-01-13T09:20:00Z',
    user_has_voted: false
  },
  {
    id: '4',
    title: 'Add export functionality for stories',
    body: 'Would love to be able to export my stories as PDF or text files to share with family.',
    category: 'idea',
    upvotes: 31,
    status: 'open',
    created_at: '2024-01-12T14:15:00Z',
    user_has_voted: false
  },
  {
    id: '5',
    title: 'Navigation menu is confusing',
    body: 'The main navigation could be more intuitive. I often get lost trying to find specific features.',
    category: 'ux',
    upvotes: 12,
    status: 'in_progress',
    created_at: '2024-01-11T11:30:00Z',
    user_has_voted: false
  }
];

// Store feedback in localStorage for persistence
const STORAGE_KEY = 'dytto_mock_feedback';
const VOTES_KEY = 'dytto_mock_votes';

const getFeedbackFromStorage = (): FeedbackItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading feedback from storage:', error);
  }
  return mockFeedback;
};

const saveFeedbackToStorage = (feedback: FeedbackItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
  } catch (error) {
    console.error('Error saving feedback to storage:', error);
  }
};

const getVotesFromStorage = (): Set<string> => {
  try {
    const stored = localStorage.getItem(VOTES_KEY);
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error reading votes from storage:', error);
  }
  return new Set(['2']); // Mock that user has voted on item 2
};

const saveVotesToStorage = (votes: Set<string>) => {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(Array.from(votes)));
  } catch (error) {
    console.error('Error saving votes to storage:', error);
  }
};

// Mock API functions
export const mockFeedbackService = {
  async getFeedback(limit = 50): Promise<{ data: FeedbackItem[] }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const feedback = getFeedbackFromStorage();
    const votes = getVotesFromStorage();
    
    // Add user vote status
    const feedbackWithVotes = feedback.map(item => ({
      ...item,
      user_has_voted: votes.has(item.id)
    }));
    
    // Sort by upvotes desc, then by date desc
    const sorted = feedbackWithVotes.sort((a, b) => {
      if (b.upvotes !== a.upvotes) {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    return { data: sorted.slice(0, limit) };
  },

  async submitFeedback(submission: FeedbackSubmission): Promise<{ data: FeedbackItem }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const feedback = getFeedbackFromStorage();
    const votes = getVotesFromStorage();
    
    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      title: submission.title,
      body: submission.body || undefined,
      category: submission.category,
      upvotes: 1, // User automatically upvotes their own submission
      status: 'open',
      created_at: new Date().toISOString(),
      user_has_voted: true
    };
    
    // Add to votes since user auto-votes
    votes.add(newFeedback.id);
    
    const updatedFeedback = [newFeedback, ...feedback];
    saveFeedbackToStorage(updatedFeedback);
    saveVotesToStorage(votes);
    
    return { data: newFeedback };
  },

  async voteFeedback(feedbackId: string): Promise<{ data: FeedbackItem }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const feedback = getFeedbackFromStorage();
    const votes = getVotesFromStorage();
    
    if (votes.has(feedbackId)) {
      throw new Error('You have already voted on this feedback');
    }
    
    const feedbackItem = feedback.find(item => item.id === feedbackId);
    if (!feedbackItem) {
      throw new Error('Feedback not found');
    }
    
    // Add vote
    votes.add(feedbackId);
    feedbackItem.upvotes += 1;
    
    saveFeedbackToStorage(feedback);
    saveVotesToStorage(votes);
    
    return { 
      data: { 
        ...feedbackItem, 
        user_has_voted: true 
      } 
    };
  }
};