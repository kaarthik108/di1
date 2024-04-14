[
  {
    id: "LeWP5eW",
    role: "user",
    content: "\n\nNumber of companies founded over time. Area chart",
  },
  {
    id: "EaOVuhT",
    role: "assistant",
    content:
      "[Sqlite query results for code: SELECT year_founded AS Year, COUNT(company_id) AS NumberOfCompanies FROM companies WHERE year_founded IS NOT NULL GROUP BY year_founded ORDER BY year_founded and chart format: area with categories: NumberOfCompanies and data index: undefined and yaxis: undefined and size: undefined]",
    display: {
      name: "query_data",
      props: {
        query:
          "SELECT year_founded AS Year, COUNT(company_id) AS NumberOfCompanies FROM companies WHERE year_founded IS NOT NULL GROUP BY year_founded ORDER BY year_founded",
        format: "area",
        title: "Number of Companies Founded Over Time",
        timeField: "Year",
        categories: ["NumberOfCompanies"],
      },
    },
  },
  {
    id: "2tbyGCk",
    role: "user",
    content: "\n\nNumber of companies by country ? bar chart",
  },
  {
    id: "1BVgyFI",
    role: "assistant",
    content:
      "[Sqlite query results for code: SELECT country AS Country, COUNT(company_id) AS NumberOfCompanies FROM companies WHERE country IS NOT NULL GROUP BY country ORDER BY NumberOfCompanies DESC and chart format: bar with categories: NumberOfCompanies and data index: Country and yaxis: undefined and size: undefined]",
    display: {
      name: "query_data",
      props: {
        query:
          "SELECT country AS Country, COUNT(company_id) AS NumberOfCompanies FROM companies WHERE country IS NOT NULL GROUP BY country ORDER BY NumberOfCompanies DESC",
        format: "bar",
        title: "Number of Companies by Country",
        categories: ["NumberOfCompanies"],
        index: "Country",
      },
    },
  },
  {
    id: "2ds5nDY",
    role: "user",
    content:
      "\n\nDistribution of companies by status (e.g., active, acquired).? Donut chart",
  },
  {
    id: "5m6duvG",
    role: "assistant",
    content:
      "[Sqlite query results for code: SELECT status AS Status, COUNT(company_id) AS NumberOfCompanies FROM companies WHERE status IS NOT NULL GROUP BY status and chart format: donut with categories: NumberOfCompanies and data index: undefined and yaxis: undefined and size: undefined]",
    display: {
      name: "query_data",
      props: {
        query:
          "SELECT status AS Status, COUNT(company_id) AS NumberOfCompanies FROM companies WHERE status IS NOT NULL GROUP BY status",
        format: "donut",
        title: "Distribution of Companies by Status",
        categories: ["NumberOfCompanies"],
      },
    },
  },
  {
    id: "SRxkFuW",
    role: "user",
    content: "\n\nTrend of team sizes over years. line chart ?",
  },
  {
    id: "S5ZT3UQ",
    role: "assistant",
    content:
      "[Sqlite query results for code: SELECT year_founded AS Year, AVG(team_size) AS AverageTeamSize FROM companies WHERE year_founded IS NOT NULL AND team_size IS NOT NULL GROUP BY year_founded ORDER BY year_founded and chart format: line with categories: AverageTeamSize and data index: undefined and yaxis: undefined and size: undefined]",
  },
  {
    id: "EGeiE0L",
    role: "user",
    content: "\n\nGive me Trend of team sizes over years as line chart",
  },
  {
    id: "t2Y5RhT",
    role: "assistant",
    content:
      "[Sqlite query results for code: SELECT year_founded AS Year, AVG(team_size) AS AverageTeamSize FROM companies WHERE year_founded IS NOT NULL AND team_size IS NOT NULL GROUP BY year_founded ORDER BY year_founded and chart format: line with categories: AverageTeamSize and data index: undefined and yaxis: undefined and size: undefined]",
    display: {
      name: "query_data",
      props: {
        query:
          "SELECT year_founded AS Year, AVG(team_size) AS AverageTeamSize FROM companies WHERE year_founded IS NOT NULL AND team_size IS NOT NULL GROUP BY year_founded ORDER BY year_founded",
        format: "line",
        title: "Trend of Average Team Sizes Over Years",
        categories: ["AverageTeamSize"],
      },
    },
  },
  {
    id: "vYiaK4J",
    role: "user",
    content: "\n\nShow me Team size of each company, listed as bar list chart",
  },
  {
    id: "mh8qqHc",
    role: "assistant",
    content:
      "[Sqlite query results for code: SELECT company_name AS CompanyName, team_size AS TeamSize FROM companies WHERE team_size IS NOT NULL ORDER BY team_size DESC and chart format: barlist with categories: TeamSize and data index: CompanyName and yaxis: undefined and size: undefined]",
  },
  {
    id: "QPP6tqv",
    role: "user",
    content:
      "\n\nShow me Team size of each company, listed as 'barlist' chart !",
  },
  {
    id: "aKhDvFG",
    role: "assistant",
    content:
      "[Sqlite query results for code: SELECT company_name AS Company, team_size AS TeamSize FROM companies WHERE team_size IS NOT NULL ORDER BY team_size DESC and chart format: barlist with categories: TeamSize and data index: undefined and yaxis: undefined and size: undefined]",
    display: {
      name: "query_data",
      props: {
        query:
          "SELECT company_name AS Company, team_size AS TeamSize FROM companies WHERE team_size IS NOT NULL ORDER BY team_size DESC",
        format: "barlist",
        title: "Team Size of Each Company",
        categories: ["TeamSize"],
      },
    },
  },
];

// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [ { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' } ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' },
//   { id: 'JIhmJ3U', role: 'assistant', content: 'Hello! How' }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' },
//   { id: 'JIhmJ3U', role: 'assistant', content: 'Hello! How' },
//   { id: 'oqJQYl1', role: 'assistant', content: 'Hello! How can' }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' },
//   { id: 'JIhmJ3U', role: 'assistant', content: 'Hello! How' },
//   { id: 'oqJQYl1', role: 'assistant', content: 'Hello! How can' },
//   { id: 'rH6vll3', role: 'assistant', content: 'Hello! How can I' }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' },
//   { id: 'JIhmJ3U', role: 'assistant', content: 'Hello! How' },
//   { id: 'oqJQYl1', role: 'assistant', content: 'Hello! How can' },
//   { id: 'rH6vll3', role: 'assistant', content: 'Hello! How can I' },
//   {
//   id: 'BT6Bvcp',
//   role: 'assistant',
//   content: 'Hello! How can I assist'
// }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' },
//   { id: 'JIhmJ3U', role: 'assistant', content: 'Hello! How' },
//   { id: 'oqJQYl1', role: 'assistant', content: 'Hello! How can' },
//   { id: 'rH6vll3', role: 'assistant', content: 'Hello! How can I' },
//   {
//   id: 'BT6Bvcp',
//   role: 'assistant',
//   content: 'Hello! How can I assist'
// },
//   {
//   id: 'xQIDQdI',
//   role: 'assistant',
//   content: 'Hello! How can I assist you'
// }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' },
//   { id: 'JIhmJ3U', role: 'assistant', content: 'Hello! How' },
//   { id: 'oqJQYl1', role: 'assistant', content: 'Hello! How can' },
//   { id: 'rH6vll3', role: 'assistant', content: 'Hello! How can I' },
//   {
//   id: 'BT6Bvcp',
//   role: 'assistant',
//   content: 'Hello! How can I assist'
// },
//   {
//   id: 'xQIDQdI',
//   role: 'assistant',
//   content: 'Hello! How can I assist you'
// },
//   {
//   id: 'idl6Cjo',
//   role: 'assistant',
//   content: 'Hello! How can I assist you today'
// }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   { id: 'SBE5Cu3', role: 'user', content: '\n\nHey big man' },
//   { id: 'wZ5Rut8', role: 'assistant', content: 'Hello' },
//   { id: '22C4WpW', role: 'assistant', content: 'Hello!' },
//   { id: 'JIhmJ3U', role: 'assistant', content: 'Hello! How' },
//   { id: 'oqJQYl1', role: 'assistant', content: 'Hello! How can' },
//   { id: 'rH6vll3', role: 'assistant', content: 'Hello! How can I' },
//   {
//   id: 'BT6Bvcp',
//   role: 'assistant',
//   content: 'Hello! How can I assist'
// },
//   {
//   id: 'xQIDQdI',
//   role: 'assistant',
//   content: 'Hello! How can I assist you'
// },
//   {
//   id: 'idl6Cjo',
//   role: 'assistant',
//   content: 'Hello! How can I assist you today'
// },
//   {
//   id: 'cWSamB3',
//   role: 'assistant',
//   content: 'Hello! How can I assist you today?'
// }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   {
//   id: 'tp3VInV',
//   role: 'user',
//   content: '\n\nshow me the total number of companies ? number chart'
// }
// ],
//   interactions: []
// }
// state------

//  {
//   chatId: 'VMioJlO',
//   messages: [
//   {
//   id: 'tp3VInV',
//   role: 'user',
//   content: '\n\nshow me the total number of companies ? number chart'
// },
//   {
//   id: 'Fcvhwze',
//   role: 'assistant',
//   content: '[Sqlite query results for code: SELECT COUNT(company_id) AS total_companies FROM companies and chart format: number with categories: total_companies and data index: undefined and yaxis: undefined and size: undefined]',
//   display: {
//   name: 'query_data',
//   props: {
//   query: 'SELECT COUNT(company_id) AS total_companies FROM companies',
//   format: 'number',
//   title: 'Total Number of Companies',
//   categories: [ 'total_companies' ]
// }
// }
// }
// ],
//   interactions: []
// }
