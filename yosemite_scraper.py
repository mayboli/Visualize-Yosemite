# Dependencies
from bs4 import BeautifulSoup
from splinter import Browser
import pandas as pd
import time
import requests
from urllib.parse import urlsplit
import tweepy
import json
from config import consumer_key, consumer_secret, access_token, access_token_secret
import api_key
from datetime import datetime
from datetime import timedelta
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/yosemite_db')

def economic_benefits():
    print('COMMENCING DATA SCRAPE FOR ECONOMIC BENEFITS INFO')
    
    #executable_path = {'executable_path': 'chromedriver.exe'}
    # use executable path below for mac, path above for windows
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    # URL of yosemite articles page to be scraped
    url = 'https://www.nps.gov/yose/learn/news/newsreleases.htm'
    browser.visit(url)
    time.sleep(2)
    # empty lists to hold raw scraped data
    article_links = []
    headlines = []
    article_contents = []
    # empty lists that will hold cleaned scraped data
    years = []
    amounts = []
    job_counts = []
    visitor_counts = []
    # empty list to hold final scraped data
    economic_benefits = []

    # go through pages 1-33 and find links of targeted articles
    for x in range(1, 34):  
        html = browser.html
        soup = BeautifulSoup(html, 'html.parser')
        article_snippets = soup.find_all('li', class_='ListingList-item')
        substring = 'Economic Benefit'
        for article_snippet in article_snippets:
            snippet_headline = article_snippet.find('h3', class_='ListingResults-title').text
            if substring in snippet_headline:
                end_link = article_snippet.find('a')['href']
                article_link = 'https://www.nps.gov' + end_link
                article_links.append(article_link)
        browser.click_link_by_text('Next ')
        time.sleep(1)

    # visit each article link and extract content
    for article_link in article_links:
        browser.visit(article_link)
        article_html = browser.html
        article_soup = BeautifulSoup(article_html, 'html.parser')
        headline = article_soup.find('div', class_='ContentHeader').text
        headline = headline.replace('\n', '')
        headlines.append(headline)
        article_content = article_soup.find('div', class_='ArticleTextGroup').text
        article_contents.append(article_content)
    # loop through headlines and extract economic benefit $ amount (in millions)
    for headline in headlines:
        headline_split = headline.split('$')[1]
        amount = headline_split[:3]
        amounts.append(amount)
    # loop through article contents and extract year, job count, and visitor count
    for article_content in article_contents:
        year_split = article_content.split('Park in ')[1]
        year = year_split[:4]
        years.append(year)
        job_split = article_content.split('supported ')[1]
        job_count = job_split[:5]
        if ',' in job_count:
            job_count = job_count.replace(',', '')
            job_counts.append(job_count)
        elif ' ' in job_count:
            job_count = job_count.replace(' ', '')
            job_counts.append(job_count)
        else: 
            job_counts.append(job_count)
        visitor_split = article_content.split('shows that')[1]
        visitor_count = visitor_split[:10]
        visitor_count = visitor_count.replace(',', '').replace('\xa0', '').replace(' ', '')
        visitor_counts.append(visitor_count)

    # append extract information into economic_benefits dictionary
    economic_benefits.append({'years': years,
                        'amounts': amounts,
                       'job_counts': job_counts,
                       'visitor_counts': visitor_counts})
    # append missing 2015 data
    economic_benefits[0]['years'].insert(2, '2015')
    economic_benefits[0]['amounts'].insert(2, '594')
    economic_benefits[0]['job_counts'].insert(2, '6890')
    economic_benefits[0]['visitor_counts'].insert(2, '4150217')

    client.yosemite_db.economic_benefits.drop()
    economic_benefits_collection = client.yosemite_db.economic_benefits
    economic_benefits_collection.update({}, economic_benefits[0], upsert=True)


    print('OBTAINED ECONOMIC BENEFITS')
    browser.quit()
    return economic_benefits
    print('-------------------------------------------------------')

def post():
    print('COMMENCING DATA SCRAPE FOR TRAIL HEAD POSTS')

    #executable_path = {'executable_path': 'chromedriver.exe'}
    # use executable path below for mac, path above for windows
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    # URL of page to be scraped
    url = 'https://www.hikespeak.com/sierras/yosemite/'
    browser.visit(url) 
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    # Examine the results, then determine element that contains sought info
    # results are returned as an iterable list
    results = soup.find_all("tr")

    client.yosemite_db.post.drop()

    ## Probably need a loop here for all 20 rows
    # Loop through returned results
    for result in results:
        # Error handling
        try:
            # Identify and return trial, distance and coordinates
            trail = result.find("td", class_="column-2").text
            trail = trail.replace('Pull', 'This')
            trail = trail.split('This')[0]
            
            distance = result.find("td", class_="column-3").text
            distance = distance.replace('s (one-way)', ' (one-way)s')
            distance = distance.split('s')[0]
            
            coordinates = result.find("td", class_="column-4").text
            lat = coordinates.split(',')[0]
            lng = coordinates.split(',')[1]
            coordinates = (float(lat), float(lng))
            # Run only if title, price, and link are available
            if (trail and distance and coordinates):
                # Print results
                print('-------------')
                print(trail)
                print(distance)
                print(coordinates)
                post = {
                    'trail': trail,
                    'distance': distance,
                    'coordinates': coordinates
                }

                post_collection = client.yosemite_db.post
                post_collection.insert_one(post)

        except Exception as e:
            print(e)

    print('OBTAINED TRAIL HEAD POSTS')
    browser.quit()
    return post
    print('-------------------------------------------------------')

def trail_table():
    print('COMMENCING DATA SCRAPE FOR TRAIL TABLE')

    #executable_path = {'executable_path': 'chromedriver.exe'}
    # use executable path below for mac, path above for windows
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    # URL of page to be scraped
    trail_table_url = 'https://www.yosemitehikes.com/hikes.htm'

    # Retrieve page with the requests module
    response = requests.get(trail_table_url)
    # Create BeautifulSoup object; parse with 'lxml'
    soup = BeautifulSoup(response.text, 'lxml')

    # Examine the results, then determine element that contains sought info
    # results are returned as an iterable list
    trail_table_results = soup.find_all('tr')

    client.yosemite_db.trail_table.drop()

    # Loop through returned results
    for trail_table_result in trail_table_results:
        # Error handling
        try:
            # Identify and return trail name
            trail_name = trail_table_result.find('td', column='Trail').text
            # Identify and return trail's distance
            raw_distance = trail_table_result.find('td', column="Distance (miles/km)").text
            if ' (' in raw_distance:
                distance = str(raw_distance[:raw_distance.find(" (")])
            else:
                distance = trail_table_result.find('td', column="Distance (miles/km)").text
            #add ".0" if distance number doesnt end with decimal place, for filter table search.
            if '.' in distance:
                distance = distance.strip()
            else:
                distance = distance.strip() + ".0"
            # Identify and return trail's elevation
            try:
                raw_elevation = trail_table_result.find('td', column="Elevation Gain (feet/meters)").text
                elevation = str(raw_elevation[:raw_elevation.find(" (")])
                if ',' in elevation:
                    elevation = elevation.replace(',', '')
                else:
                    elevation = raw_elevation[:raw_elevation.find(" (")]
            except Exception as elevation:
                elevation = trail_table_result.find('td', column="Elevation Gain (feet/meters)").text
            # Identify and return trail's crowd rating
            crowd = str(trail_table_result.find('td', column="Crowd Factor"))[44]
            if float(crowd) <=2 :
                crowd_tag = 'Low-C'
            elif float(crowd) == 3 :
                crowd_tag = 'Med-C'
            else:
                crowd_tag = 'High-C'            
            # Identify and return trail's scenery rating
            scenery = str(trail_table_result.find('td', column="Scenery Factor"))[-14]
            if (float(scenery) == 2) :
                scenery_tag = 'Low-S'
            elif float(scenery) == 5 :
                scenery_tag = 'High-S'
            else:
                scenery_tag = 'Med-S'
            # Identify and return trail's difficulty rating, retrieve only rating
            difficulty = str(trail_table_result.find('td', column="Difficulty")).split("-")[-1].split('"></div></td>')[0]
            if float(difficulty) <=3 :
                difficulty_tag = 'Low-D'
            elif (float(difficulty) >=4) and (float(difficulty) <=7) :
                difficulty_tag = 'Med-D'
            else:
                difficulty_tag = 'High-D'
            #Dictionary to be inserted as a MongoDB document
            trail_table_post = {
                'trail_name': trail_name,
                'distance': distance,
                'elevation': elevation,
                'crowd': crowd,
                'crowd_tag': crowd_tag,
                'scenery': scenery,
                'scenery_tag': scenery_tag,
                'difficulty': difficulty,
                'difficulty_tag': difficulty_tag
            }

            trail_table_collection = client.yosemite_db.trail_table
            trail_table_collection.insert_one(trail_table_post)

        except Exception as e:
            print(e)

    print('OBTAINED TRAIL TABLE')
    browser.quit()
    return trail_table_post
    print('-------------------------------------------------------')

def weather():
    print('COMMENCING DATA SCRAPE FOR WEATHER')

    #executable_path = {'executable_path': 'chromedriver.exe'}
    # use executable path below for mac, path above for windows
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    client.yosemite_db.weather.drop()

    current_weather = []
    apikey = api_key.api_key
    location = "Yosemite Valley"
    url = "http://api.openweathermap.org/data/2.5/weather?units=Imperial&appid=" + apikey+ "&q=" + location
    weather = requests.get(url).json()
    todays_temp = weather["main"]["temp"]
    todays_humid = weather["main"]["humidity"]
    todays_cloud = weather["clouds"]["all"]
    todays_wind = weather["wind"]["speed"]
    converted = datetime.utcfromtimestamp(weather["dt"])
    local_time = converted - timedelta(hours=7, minutes=0)
    weather_date = local_time.strftime("%B %d, %Y")
    current_weather.append({
        'Date': weather_date,
        'Temperature (F)': todays_temp,
        'Humidity %': todays_humid,
        'Cloudiness %': todays_cloud,
        'Wind Speed': todays_wind})

    weather_collection = client.yosemite_db.weather
    weather_collection.insert_one(current_weather[0])        

    print('OBTAINED WEATHER')
    time.sleep(5)
    browser.quit()
    return current_weather
    print('-------------------------------------------------------')

def twitter():
    print('COMMENCING DATA SCRAPE FOR TWITTER')
    tweet = []

    client.yosemite_db.twitter.drop()

    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    api = tweepy.API(auth, parser=tweepy.parsers.JSONParser())
    target_user = "YosemiteNPS"
    user_tweets_only = api.user_timeline(target_user, count=1, result_type="recent")
    user_tweets = user_tweets_only[0]["text"]
    tweet.append({
        'tweet': user_tweets})
    
    twitter_collection = client.yosemite_db.twitter
    twitter_collection.insert_one(tweet[0])

    print('OBTAINED TWEET')
    return tweet
    print('-------------------------------------------------------')

def news():
    print('COMMENCING DATA SCRAPE FOR MOST RECENT NEWS')

    #executable_path = {'executable_path': 'chromedriver.exe'}
    # use executable path below for mac, path above for windows
    executable_path = {'executable_path': '/usr/local/bin/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    client.yosemite_db.news.drop()

    url = 'https://www.nps.gov/yose/learn/news/newsreleases.htm'
    browser.visit(url)
    html = browser.html
    soup = BeautifulSoup(html, 'html.parser')
    recent_news = []
    # Article Title
    news_title = soup.find("h3", class_="ListingResults-title").text
    # Article Date
    article_date = soup.find("div", class_="ListingMeta").text
    # Link to full article
    results = soup.find("li", class_="ListingList-item ListingResults-item")
    news_link = results.find("a")["href"]
    split_url = urlsplit(url)
    full_news_link = split_url.scheme + "://" + split_url.netloc + news_link
    # Article summary
    article_text = soup.find("p", class_="ListingResults-description").text
    
    recent_news.append({'news_title': news_title,
                'article_date': article_date,
                'article_text': article_text})

    news_collection = client.yosemite_db.news
    news_collection.insert_one(recent_news[0])

    print('OBTAINED MOST RECENT NEWS')
    time.sleep(5)
    browser.quit()
    return recent_news
    print('-------------------------------------------------------')

if __name__ == '__main__': 
    print('INITIALIZING DATA SCRAPE FOR YOSEMITE NATIONAL PARK')
    print('-------------------------------------------------------')

    economic_benefits()
    post()
    twitter()
    news()
    weather()
    trail_table()

    print('SCRAPING COMPLETED')
    print('-------------------------------------------------------')