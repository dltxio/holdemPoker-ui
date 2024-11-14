export const SAMPLE_TAGS = [
  {
    id: 1,
    label: 'Tag 1'
  },
  {
    id: 2,
    label: 'Tag 2'
  },
  {
    id: 3,
    label: 'Tag 3'
  },
];

export const SAMPLE_MODULES = [
  {
    id: 1,
    label: 'Module 1',
    status: false,
    child: [],
  },
  {
    id: 2,
    label: 'Module 2',
    status: false,
    child: [
      {
        id: 21,
        label: 'Module 21',
        status: false,
        child: [],
      },
      {
        id: 22,
        label: 'Module 22',
        status: false,
        child: [],
      }
    ],
  },
  {
    id: 3,
    label: 'Module 3',
    status: false,
    child: [
      {
        id: 31,
        label: 'Module 31',
        status: false,
        child: [],
      },
      {
        id: 32,
        label: 'Module 32',
        status: false,
        child: [
          {
            id: 321,
            label: 'Module 321',
            status: false,
            child: [],
          },
        ],
      }
    ],
  },
];