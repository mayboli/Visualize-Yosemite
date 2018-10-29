# Project Proposal

Topic: Yosemite National Park

Tools: Python, JavaScript, HTML/CSS, jQuery, d3, Leaflet, Plotly, Bootstrap, RESTful APIs, Splinter, BeautifulSoup, MongoDB

Hiking and National parks have been trending in the last few years; therefore we want to gain an insight on one of the most popular national parks in the country, Yosemite. In order to research this, we retrieved data for visitor counts for the last 110 years and economic benefits from 2011-2017 and plotted this information on interactive charts and graphs using Leaflet and Plotly. We also scraped recent news from Yosemite's website and the most recent Tweet from Yosemite NPS. The weather for Yosemite is from Open Weather Map, and it was obtained through the API. After getting all the data, we stored the information into MongoDB and then using a Python Flask powered RESTful API, we displayed the data onto a webpage. 

On the homepage, the most recent news and tweet is shown along with the weather. There is a slideshow displaying the economic benefits of visiting Yosemite along with a map of the park. 

On the trails page, there is an interactive map of entrances and trailheads and a filterable table where you can either search by trail name, distance(feet), elevation gain(feet), crowdedness, scenery factor, or difficulty. 

On the visitor insights page, there is an interactive visitor graph where users can zoom in to a specific period, a graph of visitor counts per trail entrance, and a graph showing the amount of visitors vs the amount of local jobs from 2012-2017. 

Resources:
OpenWeatherMap API - weather for Yosemite
Yosemite News - https://www.nps.gov/yose/learn/news/newsreleases.htm
Yosemite NPS Twitter - https://twitter.com/YosemiteNPS 
Trail head coordinates - https://www.hikespeak.com/sierras/yosemite/
Hiking Trails - https://www.yosemitehikes.com/hikes.htm
Visitor Counts for Different Regions of Yosemite - https://irma.nps.gov/Stats/SSRSReports/Park%20Specific%20Reports/Traffic%20Counts?Park=YOSE
Annual Visitors for Yosemite (1906-2017)- https://irma.nps.gov/Stats/SSRSReports/Park%20Specific%20Reports/Annual%20Park%20Recreation%20Visitation%20(1904%20-%20Last%20Calendar%20Year)?Park=YOSE
Individual Yosemite Newsletters for Economic Benefits from (2011-2017) 
Economic Contributions - https://www.nps.gov/subjects/socialscience/vse.htm
Yosemite Website - https://www.nps.gov/yose/index.htm
