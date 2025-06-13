export const boards = [
  {
    id: '1',
    name: 'Platform Launch',
    columns: [
      {
        id: '1',
        name: 'Todo',
        tasks: [
          {
            id: '1',
            title: 'Build UI for onboarding flow',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                id: '1',
                title: 'Sign up page',
                is_completed: true,
              },
              {
                id: '2',
                title: 'Sign in page',
                is_completed: false,
              },
              {
                id: '3',
                title: 'Welcome page',
                is_completed: false,
              },
            ],
          },
          {
            id: '2',
            title: 'Build UI for search',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                id: '4',
                title: 'Search page',
                is_completed: false,
              },
            ],
          },
          {
            id: '3',
            title: 'Build settings UI',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                id: '5',
                title: 'Account page',
                is_completed: false,
              },
              {
                id: '6',
                title: 'Billing page',
                is_completed: false,
              },
            ],
          },
          {
            id: '4',
            title: 'QA and test all major user journeys',
            description:
              'Once we feel version one is ready, we need to rigorously test it both internally and externally to identify any major gaps.',
            status: 'Todo',
            subtasks: [
              {
                id: '7',
                title: 'Internal testing',
                is_completed: false,
              },
              {
                id: '8',
                title: 'External testing',
                is_completed: false,
              },
            ],
          },
        ],
      },
      {
        id: '2',
        name: 'Doing',
        tasks: [
          {
            id: '5',
            title: 'Design settings and search pages',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                id: '9',
                title: 'Settings - Account page',
                is_completed: true,
              },
              {
                id: '10',
                title: 'Settings - Billing page',
                is_completed: true,
              },
              {
                id: '11',
                title: 'Search page',
                is_completed: false,
              },
            ],
          },
          {
            id: '6',
            title: 'Add account management endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                id: '12',
                title: 'Upgrade plan',
                is_completed: true,
              },
              {
                id: '13',
                title: 'Cancel plan',
                is_completed: true,
              },
              {
                id: '14',
                title: 'Update payment method',
                is_completed: false,
              },
            ],
          },
          {
            id: '7',
            title: 'Design onboarding flow',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                id: '15',
                title: 'Sign up page',
                is_completed: true,
              },
              {
                id: '16',
                title: 'Sign in page',
                is_completed: false,
              },
              {
                id: '17',
                title: 'Welcome page',
                is_completed: false,
              },
            ],
          },
          {
            id: '8',
            title: 'Add search enpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                id: '18',
                title: 'Add search endpoint',
                is_completed: true,
              },
              {
                id: '19',
                title: 'Define search filters',
                is_completed: false,
              },
            ],
          },
          {
            id: '9',
            title: 'Add authentication endpoints',
            description: '',
            status: 'Doing',
            subtasks: [
              {
                id: '20',
                title: 'Define user model',
                is_completed: true,
              },
              {
                id: '21',
                title: 'Add auth endpoints',
                is_completed: false,
              },
            ],
          },
          {
            id: '10',
            title:
              'Research pricing points of various competitors and trial different business models',
            description:
              "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
            status: 'Doing',
            subtasks: [
              {
                id: '2',
                title: 'Research competitor pricing and business models',
                is_completed: true,
              },
              {
                id: '23',
                title: 'Outline a business model that works for our solution',
                is_completed: false,
              },
              {
                id: '24',
                title:
                  'Talk to potential customers about our proposed solution and ask for fair price expectancy',
                is_completed: false,
              },
            ],
          },
        ],
      },
      {
        id: '3',
        name: 'Done',
        tasks: [
          {
            id: '11',
            title: 'Conduct 5 wireframe tests',
            description:
              'Ensure the layout continues to make sense and we have strong buy-in from potential users.',
            status: 'Done',
            subtasks: [
              {
                id: '25',
                title: 'Complete 5 wireframe prototype tests',
                is_completed: true,
              },
            ],
          },
          {
            id: '12',
            title: 'Create wireframe prototype',
            description:
              'Create a greyscale clickable wireframe prototype to test our asssumptions so far.',
            status: 'Done',
            subtasks: [
              {
                id: '26',
                title: 'Create clickable wireframe prototype in Balsamiq',
                is_completed: true,
              },
            ],
          },
          {
            id: '13',
            title: 'Review results of usability tests and iterate',
            description:
              "Keep iterating through the subtasks until we're clear on the core concepts for the app.",
            status: 'Done',
            subtasks: [
              {
                id: '27',
                title:
                  'Meet to review notes from previous tests and plan changes',
                is_completed: true,
              },
              {
                id: '28',
                title: 'Make changes to paper prototypes',
                is_completed: true,
              },
              {
                id: '29',
                title: 'Conduct 5 usability tests',
                is_completed: true,
              },
            ],
          },
          {
            id: '14',
            title:
              'Create paper prototypes and conduct 10 usability tests with potential customers',
            description: '',
            status: 'Done',
            subtasks: [
              {
                id: '30',
                title: 'Create paper prototypes for version one',
                is_completed: true,
              },
              {
                id: '31',
                title: 'Complete 10 usability tests',
                is_completed: true,
              },
            ],
          },
          {
            id: '15',
            title: 'Market discovery',
            description:
              'We need to define and refine our core product. Interviews will help us learn common pain points and help us define the strongest MVP.',
            status: 'Done',
            subtasks: [
              {
                id: '32',
                title: 'Interview 10 prospective customers',
                is_completed: true,
              },
            ],
          },
          {
            id: '16',
            title: 'Competitor analysis',
            description: '',
            status: 'Done',
            subtasks: [
              {
                id: '3',
                title: 'Find direct and indirect competitors',
                is_completed: true,
              },
              {
                id: '34',
                title: 'SWOT analysis for each competitor',
                is_completed: true,
              },
            ],
          },
          {
            id: '17',
            title: 'Research the market',
            description:
              'We need to get a solid overview of the market to ensure we have up-to-date estimates of market size and demand.',
            status: 'Done',
            subtasks: [
              {
                id: '35',
                title: 'Write up research analysis',
                is_completed: true,
              },
              {
                id: '36',
                title: 'Calculate TAM',
                is_completed: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Marketing Plan',
    columns: [
      {
        id: '4',
        name: 'Todo',
        tasks: [
          {
            id: '18',
            title: 'Plan Product Hunt launch',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                id: '37',
                title: 'Find hunter',
                is_completed: false,
              },
              {
                id: '38',
                title: 'Gather assets',
                is_completed: false,
              },
              {
                id: '39',
                title: 'Draft product page',
                is_completed: false,
              },
              {
                id: '40',
                title: 'Notify customers',
                is_completed: false,
              },
              {
                id: '41',
                title: 'Notify network',
                is_completed: false,
              },
              {
                id: '42',
                title: 'Launch!',
                is_completed: false,
              },
            ],
          },
          {
            id: '19',
            title: 'Share on Show HN',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                id: '43',
                title: 'Draft out HN post',
                is_completed: false,
              },
              {
                id: '44',
                title: 'Get feedback and refine',
                is_completed: false,
              },
              {
                id: '45',
                title: 'Publish post',
                is_completed: false,
              },
            ],
          },
          {
            id: '20',
            title: 'Write launch article to publish on multiple channels',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                id: '46',
                title: 'Write article',
                is_completed: false,
              },
              {
                id: '47',
                title: 'Publish on LinkedIn',
                is_completed: false,
              },
              {
                id: '48',
                title: 'Publish on Inndie Hackers',
                is_completed: false,
              },
              {
                id: '49',
                title: 'Publish on Medium',
                is_completed: false,
              },
            ],
          },
        ],
      },
      {
        id: '5',
        name: 'Doing',
        tasks: [],
      },
      {
        id: '6',
        name: 'Done',
        tasks: [],
      },
    ],
  },
  {
    id: '3',
    name: 'Roadmap',
    columns: [
      {
        id: '7',
        name: 'Now',
        tasks: [
          {
            id: '21',
            title: 'Launch version one',
            description: '',
            status: 'Todo',
            subtasks: [
              {
                id: '50',
                title: 'Launch privately to our waitlist',
                is_completed: false,
              },
              {
                id: '51',
                title: 'Launch publicly on PH, HN, etc.',
                is_completed: false,
              },
            ],
          },
          {
            id: '22',
            title: 'Review early feedback and plan next steps for roadmap',
            description:
              "Beyond the initial launch, we're keeping the initial roadmap completely empty. This meeting will help us plan out our next steps based on actual customer feedback.",
            status: 'Todo',
            subtasks: [
              {
                id: '52',
                title: 'Interview 10 customers',
                is_completed: false,
              },
              {
                id: '53',
                title: 'Review common customer pain points and suggestions',
                is_completed: false,
              },
              {
                id: '54',
                title: 'Outline next steps for our roadmap',
                is_completed: false,
              },
            ],
          },
        ],
      },
      {
        id: '8',
        name: 'Next',
        tasks: [],
      },
      {
        id: '9',
        name: 'Later',
        tasks: [],
      },
    ],
  },
]
