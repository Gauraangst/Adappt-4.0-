// Mock data storage for demo mode (without MongoDB)
// In-memory storage for appliances and usage data

const mockData = {
  appliances: [
    {
      _id: 'app-1',
      name: 'Refrigerator',
      userId: 'demo-user-123',
      powerRating: 150,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: 'app-2',
      name: 'Air Conditioner',
      userId: 'demo-user-123',
      powerRating: 2000,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: 'app-3',
      name: 'Washing Machine',
      userId: 'demo-user-123',
      powerRating: 500,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: 'app-4',
      name: 'TV',
      userId: 'demo-user-123',
      powerRating: 100,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: 'app-5',
      name: 'Microwave',
      userId: 'demo-user-123',
      powerRating: 800,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: 'app-6',
      name: 'Dishwasher',
      userId: 'demo-user-123',
      powerRating: 1200,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: 'app-7',
      name: 'Computer',
      userId: 'demo-user-123',
      powerRating: 300,
      createdAt: new Date('2024-01-01')
    },
    {
      _id: 'app-8',
      name: 'LED Lights',
      userId: 'demo-user-123',
      powerRating: 60,
      createdAt: new Date('2024-01-01')
    }
  ],
  
  usage: [
    // Last 7 days of data
    { _id: 'u-1', applianceId: 'app-1', timestamp: new Date('2024-12-25'), consumption: 2.5 },
    { _id: 'u-2', applianceId: 'app-2', timestamp: new Date('2024-12-25'), consumption: 3.8 },
    { _id: 'u-3', applianceId: 'app-3', timestamp: new Date('2024-12-25'), consumption: 1.2 },
    { _id: 'u-4', applianceId: 'app-4', timestamp: new Date('2024-12-25'), consumption: 0.5 },
    
    { _id: 'u-5', applianceId: 'app-1', timestamp: new Date('2024-12-26'), consumption: 2.3 },
    { _id: 'u-6', applianceId: 'app-2', timestamp: new Date('2024-12-26'), consumption: 4.2 },
    { _id: 'u-7', applianceId: 'app-3', timestamp: new Date('2024-12-26'), consumption: 0.8 },
    { _id: 'u-8', applianceId: 'app-4', timestamp: new Date('2024-12-26'), consumption: 0.6 },
    
    { _id: 'u-9', applianceId: 'app-1', timestamp: new Date('2024-12-27'), consumption: 2.4 },
    { _id: 'u-10', applianceId: 'app-2', timestamp: new Date('2024-12-27'), consumption: 3.5 },
    { _id: 'u-11', applianceId: 'app-3', timestamp: new Date('2024-12-27'), consumption: 1.5 },
    { _id: 'u-12', applianceId: 'app-4', timestamp: new Date('2024-12-27'), consumption: 0.4 },
    
    { _id: 'u-13', applianceId: 'app-1', timestamp: new Date('2024-12-28'), consumption: 2.6 },
    { _id: 'u-14', applianceId: 'app-2', timestamp: new Date('2024-12-28'), consumption: 4.0 },
    { _id: 'u-15', applianceId: 'app-3', timestamp: new Date('2024-12-28'), consumption: 0.9 },
    { _id: 'u-16', applianceId: 'app-4', timestamp: new Date('2024-12-28'), consumption: 0.5 },
    
    { _id: 'u-17', applianceId: 'app-1', timestamp: new Date('2024-12-29'), consumption: 2.5 },
    { _id: 'u-18', applianceId: 'app-2', timestamp: new Date('2024-12-29'), consumption: 3.9 },
    { _id: 'u-19', applianceId: 'app-3', timestamp: new Date('2024-12-29'), consumption: 1.1 },
    { _id: 'u-20', applianceId: 'app-4', timestamp: new Date('2024-12-29'), consumption: 0.6 },
    
    { _id: 'u-21', applianceId: 'app-1', timestamp: new Date('2024-12-30'), consumption: 2.7 },
    { _id: 'u-22', applianceId: 'app-2', timestamp: new Date('2024-12-30'), consumption: 4.5 },
    { _id: 'u-23', applianceId: 'app-3', timestamp: new Date('2024-12-30'), consumption: 1.3 },
    { _id: 'u-24', applianceId: 'app-4', timestamp: new Date('2024-12-30'), consumption: 0.7 },
    
    { _id: 'u-25', applianceId: 'app-1', timestamp: new Date('2024-12-31'), consumption: 2.4 },
    { _id: 'u-26', applianceId: 'app-2', timestamp: new Date('2024-12-31'), consumption: 3.7 },
    { _id: 'u-27', applianceId: 'app-3', timestamp: new Date('2024-12-31'), consumption: 1.0 },
    { _id: 'u-28', applianceId: 'app-4', timestamp: new Date('2024-12-31'), consumption: 0.5 }
  ]
};

// Helper function to get appliance by ID
const getApplianceById = (id) => {
  return mockData.appliances.find(a => a._id === id);
};

// Helper function to add usage with appliance info
const getUsageWithAppliance = (usageItem) => {
  const appliance = getApplianceById(usageItem.applianceId);
  return {
    ...usageItem,
    applianceId: appliance
  };
};

module.exports = {
  mockData,
  getApplianceById,
  getUsageWithAppliance
};
