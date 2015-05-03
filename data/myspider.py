import json
from scrapy import Spider, Item, Field

class MySpider(Spider):
    name = 'myspider'

	# part 1. get a list of all links, comment out when not running part 1
    """
    times_crawled = 0
    start_urls = ['https://courses.illinois.edu/schedule/2014/fall/CS/', 'https://courses.illinois.edu/schedule/2015/spring/CS/']
    class_links = dict()
    def parse(self, response):
        for elem in response.css('#default-dt a').xpath('@href'):
            link = elem.extract()
            class_num = int(link[-3:])
            if not class_num in self.class_links:
                self.class_links[class_num] = link

        self.times_crawled += 1
        if self.times_crawled == len(self.start_urls):
            print self.class_links.values()
    	return []
    #"""

    # part 2. parses data from the links, comment out when not running part 2
    """
    times_crawled = 0
    base_url = 'https://courses.illinois.edu'
    class_links = [u'/schedule/2015/spring/CS/512', u'/schedule/2015/spring/CS/519', u'/schedule/2014/fall/CS/523', u'/schedule/2014/fall/CS/524', u'/schedule/2015/spring/CS/525', u'/schedule/2015/spring/CS/526', u'/schedule/2014/fall/CS/527', u'/schedule/2015/spring/CS/533', u'/schedule/2015/spring/CS/536', u'/schedule/2014/fall/CS/538', u'/schedule/2014/fall/CS/541', u'/schedule/2015/spring/CS/543', u'/schedule/2015/spring/CS/548', u'/schedule/2014/fall/CS/549', u'/schedule/2015/spring/CS/555', u'/schedule/2014/fall/CS/556', u'/schedule/2014/fall/CS/563', u'/schedule/2014/fall/CS/571', u'/schedule/2014/fall/CS/573', u'/schedule/2015/spring/CS/576', u'/schedule/2015/spring/CS/579', u'/schedule/2014/fall/CS/584', u'/schedule/2014/fall/CS/591', u'/schedule/2014/fall/CS/597', u'/schedule/2014/fall/CS/598', u'/schedule/2014/fall/CS/599', u'/schedule/2014/fall/CS/100', u'/schedule/2014/fall/CS/101', u'/schedule/2014/fall/CS/102', u'/schedule/2014/fall/CS/105', u'/schedule/2014/fall/CS/125', u'/schedule/2014/fall/CS/173', u'/schedule/2014/fall/CS/196', u'/schedule/2014/fall/CS/199', u'/schedule/2014/fall/CS/210', u'/schedule/2014/fall/CS/225', u'/schedule/2014/fall/CS/233', u'/schedule/2014/fall/CS/241', u'/schedule/2014/fall/CS/242', u'/schedule/2014/fall/CS/296', u'/schedule/2014/fall/CS/357', u'/schedule/2014/fall/CS/397', u'/schedule/2014/fall/CS/398', u'/schedule/2015/spring/CS/410', u'/schedule/2014/fall/CS/411', u'/schedule/2014/fall/CS/412', u'/schedule/2014/fall/CS/413', u'/schedule/2014/fall/CS/418', u'/schedule/2014/fall/CS/419', u'/schedule/2014/fall/CS/420', u'/schedule/2014/fall/CS/421', u'/schedule/2015/spring/CS/422', u'/schedule/2015/spring/CS/423', u'/schedule/2014/fall/CS/424', u'/schedule/2014/fall/CS/425', u'/schedule/2014/fall/CS/426', u'/schedule/2014/fall/CS/427', u'/schedule/2015/spring/CS/428', u'/schedule/2015/spring/CS/429', u'/schedule/2014/fall/CS/431', u'/schedule/2014/fall/CS/433', u'/schedule/2014/fall/CS/438', u'/schedule/2014/fall/CS/440', u'/schedule/2014/fall/CS/446', u'/schedule/2014/fall/CS/447', u'/schedule/2014/fall/CS/450', u'/schedule/2015/spring/CS/460', u'/schedule/2014/fall/CS/461', u'/schedule/2015/spring/CS/463', u'/schedule/2014/fall/CS/465', u'/schedule/2015/spring/CS/466', u'/schedule/2014/fall/CS/467', u'/schedule/2014/fall/CS/473', u'/schedule/2014/fall/CS/476', u'/schedule/2015/spring/CS/477', u'/schedule/2014/fall/CS/481', u'/schedule/2015/spring/CS/482', u'/schedule/2014/fall/CS/483', u'/schedule/2015/spring/CS/484', u'/schedule/2014/fall/CS/491', u'/schedule/2014/fall/CS/492', u'/schedule/2015/spring/CS/493', u'/schedule/2015/spring/CS/494', u'/schedule/2014/fall/CS/498', u'/schedule/2014/fall/CS/499', u'/schedule/2015/spring/CS/511']
    start_urls = [base_url + link for link in class_links]
    class_data = list()
    def parse(self, response):
        class_id = response.css('h1.app-inline::text')[0].extract()
        class_name = response.css('span.app-label::text')[0].extract()
        class_description = response.css('#app-course-info p::text')[1].extract()
        data = {'id': class_id, 'name': class_name, 'description': class_description }
        self.class_data.append(data)

        self.times_crawled += 1
        if self.times_crawled == len(self.start_urls):
            print json.dumps(self.class_data)
        return []
    #"""

    # part 3. gets all professor names, comment out when not running part 3
    #"""
    start_urls = ['https://ws.engr.illinois.edu/directory/list.asp?unit=1434&cat=15,22,9']
    def parse(self, response):
        names = response.css('a::text').extract()[::2]
        formatted_names = [name.replace('  ', ' ') for name in names]
        print json.dumps(formatted_names)
        return []
    #"""
