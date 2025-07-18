import { Item } from './model';

export const mockItems: Item[] = [
  {
    id: 1,
    name: 'Felidae',
    children: [
      {
        id: 11,
        name: 'Lion',
        children: []
      },
      {
        id: 12,
        name: 'Tiger',
        children: []
      },
      {
        id: 13,
        name: 'Leopard',
        children: []
      }
    ]
  },
  {
    id: 2,
    name: 'Accipitridae',
    children: [
      {
        id: 21,
        name: 'Eagle',
        children: []
      },
      {
        id: 22,
        name: 'Hawk',
        children: []
      },
      {
        id: 23,
        name: 'Kite',
        children: []
      }
    ]
  },
  {
    id: 3,
    name: 'Squamata',
    children: []
  },
  {
    id: 4,
    name: 'Salmonidae',
    children: [
      {
        id: 41,
        name: 'Salmon',
        children: []
      },
      {
        id: 42,
        name: 'Trout',
        children: []
      },
      {
        id: 43,
        name: 'Char',
        children: []
      }
    ]
  },
  {
    id: 5,
    name: 'Lepidoptera',
    children: []
  },
  {
    id: 6,
    name: 'Canidae',
    children: [
      {
        id: 61,
        name: 'Wolf',
        children: []
      },
      {
        id: 62,
        name: 'Fox',
        children: []
      },
      {
        id: 63,
        name: 'Coyote',
        children: []
      }
    ]
  },
  {
    id: 7,
    name: 'Cetacea',
    children: [
      {
        id: 71,
        name: 'Dolphin',
        children: []
      },
      {
        id: 72,
        name: 'Whale',
        children: []
      },
      {
        id: 73,
        name: 'Porpoise',
        children: []
      }
    ]
  },
  {
    id: 8,
    name: 'Arachnida',
    children: []
  },
  {
    id: 9,
    name: 'Ursidae',
    children: [
      {
        id: 91,
        name: 'Grizzly Bear',
        children: []
      },
      {
        id: 92,
        name: 'Polar Bear',
        children: []
      },
      {
        id: 93,
        name: 'Panda',
        children: []
      }
    ]
  },
  {
    id: 10,
    name: 'Cephalopoda',
    children: [
      {
        id: 101,
        name: 'Octopus',
        children: []
      },
      {
        id: 102,
        name: 'Squid',
        children: []
      },
      {
        id: 103,
        name: 'Cuttlefish',
        children: []
      }
    ]
  }
];