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
                isCompleted: true,
              },
              {
                id: '2',
                title: 'Sign in page',
                isCompleted: false,
              },
              {
                id: '3',
                title: 'Welcome page',
                isCompleted: false,
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
                isCompleted: false,
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
                isCompleted: false,
              },
              {
                id: '6',
                title: 'Billing page',
                isCompleted: false,
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
                isCompleted: false,
              },
              {
                id: '8',
                title: 'External testing',
                isCompleted: false,
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
                isCompleted: true,
              },
              {
                id: '10',
                title: 'Settings - Billing page',
                isCompleted: true,
              },
              {
                id: '11',
                title: 'Search page',
                isCompleted: false,
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
                isCompleted: true,
              },
              {
                id: '13',
                title: 'Cancel plan',
                isCompleted: true,
              },
              {
                id: '14',
                title: 'Update payment method',
                isCompleted: false,
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
                isCompleted: true,
              },
              {
                id: '16',
                title: 'Sign in page',
                isCompleted: false,
              },
              {
                id: '17',
                title: 'Welcome page',
                isCompleted: false,
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
                isCompleted: true,
              },
              {
                id: '19',
                title: 'Define search filters',
                isCompleted: false,
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
                isCompleted: true,
              },
              {
                id: '21',
                title: 'Add auth endpoints',
                isCompleted: false,
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
                isCompleted: true,
              },
              {
                id: '23',
                title: 'Outline a business model that works for our solution',
                isCompleted: false,
              },
              {
                id: '24',
                title:
                  'Talk to potential customers about our proposed solution and ask for fair price expectancy',
                isCompleted: false,
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
                isCompleted: true,
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
                isCompleted: true,
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
                isCompleted: true,
              },
              {
                id: '28',
                title: 'Make changes to paper prototypes',
                isCompleted: true,
              },
              {
                id: '29',
                title: 'Conduct 5 usability tests',
                isCompleted: true,
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
                isCompleted: true,
              },
              {
                id: '31',
                title: 'Complete 10 usability tests',
                isCompleted: true,
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
                isCompleted: true,
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
                isCompleted: true,
              },
              {
                id: '34',
                title: 'SWOT analysis for each competitor',
                isCompleted: true,
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
                isCompleted: true,
              },
              {
                id: '36',
                title: 'Calculate TAM',
                isCompleted: true,
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
                isCompleted: false,
              },
              {
                id: '38',
                title: 'Gather assets',
                isCompleted: false,
              },
              {
                id: '39',
                title: 'Draft product page',
                isCompleted: false,
              },
              {
                id: '40',
                title: 'Notify customers',
                isCompleted: false,
              },
              {
                id: '41',
                title: 'Notify network',
                isCompleted: false,
              },
              {
                id: '42',
                title: 'Launch!',
                isCompleted: false,
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
                isCompleted: false,
              },
              {
                id: '44',
                title: 'Get feedback and refine',
                isCompleted: false,
              },
              {
                id: '45',
                title: 'Publish post',
                isCompleted: false,
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
                isCompleted: false,
              },
              {
                id: '47',
                title: 'Publish on LinkedIn',
                isCompleted: false,
              },
              {
                id: '48',
                title: 'Publish on Inndie Hackers',
                isCompleted: false,
              },
              {
                id: '49',
                title: 'Publish on Medium',
                isCompleted: false,
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
                isCompleted: false,
              },
              {
                id: '51',
                title: 'Launch publicly on PH, HN, etc.',
                isCompleted: false,
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
                isCompleted: false,
              },
              {
                id: '53',
                title: 'Review common customer pain points and suggestions',
                isCompleted: false,
              },
              {
                id: '54',
                title: 'Outline next steps for our roadmap',
                isCompleted: false,
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
