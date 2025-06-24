export const activities = [
  // Disguise activities
  {
    id: 1,
    type: "disguise",
    title: "ZURAKO MODE",
    description: "Nobody will recognize me in this perfect disguise!",
    date: "2024-01-15",
    data: { 
      effectiveness: 2, 
      confidence: 11,
      recognitionRate: 98 
    }
  },
  {
    id: 2,
    type: "disguise",
    title: "CAPTAIN KATSURA",
    description: "Commanding the seas with revolutionary spirit!",
    date: "2024-01-14",
    data: { 
      effectiveness: 3, 
      confidence: 10,
      recognitionRate: 95 
    }
  },
  {
    id: 3,
    type: "disguise",
    title: "MASKED REVOLUTIONARY",
    description: "A mysterious figure fights for justice!",
    date: "2024-01-13",
    data: { 
      effectiveness: 6, 
      confidence: 9,
      recognitionRate: 70 
    }
  },

  // Mission activities
  {
    id: 4,
    type: "mission",
    title: "OPERATION: STRAWBERRY LIBERATION",
    description: "Infiltrate the convenience store and secure strawberry milk supplies for the revolution!",
    date: "2024-01-15",
    data: { 
      objectives: [
        { text: "Enter store undetected", completed: true },
        { text: "Acquire strawberry milk", completed: true },
        { text: "Escape before recognition", completed: false }
      ],
      failureReason: "Loudly declared 'ZURA JANAI, KATSURA DA!' at checkout"
    }
  },
  {
    id: 5,
    type: "mission",
    title: "JOUI RECRUITMENT DRIVE",
    description: "Spread the word about the revolutionary cause to gain new allies!",
    date: "2024-01-14",
    data: { 
      objectives: [
        { text: "Set up recruitment booth", completed: true },
        { text: "Distribute revolutionary pamphlets", completed: true },
        { text: "Recruit at least 5 new members", completed: false }
      ],
      recruitsGained: 0,
      notesLeft: 247
    }
  },
  {
    id: 6,
    type: "mission",
    title: "ANTI-GOVERNMENT PROTEST",
    description: "Organize a peaceful demonstration against oppressive policies!",
    date: "2024-01-13",
    data: { 
      objectives: [
        { text: "Prepare protest signs", completed: true },
        { text: "Gather supporters", completed: false },
        { text: "March to government building", completed: false }
      ],
      attendees: 1,
      duration: "5 minutes"
    }
  },

  // Elizabeth message activities
  {
    id: 7,
    type: "elizabeth_message",
    title: "TODAY'S SIGN",
    description: "BOSS IS BROKE AGAIN",
    date: "2024-01-15",
    data: { 
      mood: "Perpetually Unimpressed",
      previousSign: "NEED MONEY FOR FOOD",
      signChanges: 3
    }
  },
  {
    id: 8,
    type: "elizabeth_message",
    title: "EMERGENCY BULLETIN",
    description: "STRAWBERRY MILK FUND EMPTY",
    date: "2024-01-14",
    data: { 
      mood: "Concerned",
      urgencyLevel: "HIGH",
      relatedMission: "OPERATION: STRAWBERRY LIBERATION"
    }
  },
  {
    id: 9,
    type: "elizabeth_message",
    title: "DAILY REMINDER",
    description: "BOSS FORGOT TO EAT AGAIN",
    date: "2024-01-13",
    data: { 
      mood: "Motherly Concerned",
      reminderCount: 7,
      ignoredWarnings: 5
    }
  },

  // Special events
  {
    id: 10,
    type: "special_event",
    title: "KATSURAP BATTLE CHALLENGE",
    description: "Challenged a street rapper to defend the honor of revolutionary hip-hop!",
    date: "2024-01-12",
    data: { 
      opponent: "MC Shinsengumi",
      rounds: 3,
      winner: "Katsura",
      crowdReaction: "Confused but entertained",
      verseQuality: "Surprisingly good"
    }
  },
  {
    id: 11,
    type: "special_event",
    title: "ELIZABETH GOES MISSING",
    description: "Spent the entire day searching for Elizabeth, only to find him at the pet store looking at fish.",
    date: "2024-01-11",
    data: { 
      searchDuration: "8 hours",
      placesSearched: 23,
      panicLevel: "MAXIMUM",
      elizabethExplanation: "Wanted sushi"
    }
  }
];

export const activityTypes = [
  {
    key: "disguise",
    name: "Disguise Operations",
    icon: "🎭",
    color: "purple",
    description: "Katsura's various disguise attempts and their effectiveness"
  },
  {
    key: "mission",
    name: "Revolutionary Missions",
    icon: "⚔️",
    color: "red",
    description: "Operations for the Joui cause and their outcomes"
  },
  {
    key: "elizabeth_message",
    name: "Elizabeth Communications",
    icon: "🐧",
    color: "blue",
    description: "Messages and signs from Elizabeth"
  },
  {
    key: "special_event",
    name: "Special Events",
    icon: "⭐",
    color: "gold",
    description: "Unique and memorable incidents"
  }
];

export const getTodaysActivities = () => {
  const today = new Date().toISOString().split('T')[0];
  return activities.filter(activity => activity.date === today);
};

export const getActivitiesByType = (type: string) => {
  return activities.filter(activity => activity.type === type);
};

export const getRandomActivity = (type?: string) => {
  const filteredActivities = type ? getActivitiesByType(type) : activities;
  return filteredActivities[Math.floor(Math.random() * filteredActivities.length)];
};
