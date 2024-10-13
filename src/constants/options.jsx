export const SelectTravelsList=[
    {
        id:1,
        title:'Just Me',
        desc:'A sole travels in exploration',
        icon:'✈',
        people:'1'
    },
    {
        id:2,
        title:'A Couple',
        desc:'Two travels in tandem',
        icon:'🥂',
        people:'2'
    },
    {
        id:3,
        title:'Family',
        desc:'A group of fun loving adv',
        icon:'🏠',
        people:'3 to 5 people'
    }
]
export const SelectBudgetOptions=[
    {
        id:1,
        title:'Cheap',
        desc:'Stay conscious of costs',
        icon:'💵'
    },
    {
        id:2,
        title:'Average',
        desc:'Keep cost on average side',
        icon:'💰'
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icon:'🤑'
    }
]
export const AI_PROMPT = 'Generate travel plan for location: {location}, for {totalDays} days for {traveler} with a {budget} budget, Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest iternary with placeName, Place Details, Place Image url, Geo Coordinates, ticket pricing, rating, Time travel each of the location for {totalDays} days with each day plan with best time to visit in .JSON format'