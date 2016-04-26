#import libraries
import sys
import os
import csv
import time
import numpy as np
import datetime
from datetime import date, time
from datetime import datetime as dtime
from datetime import timedelta as td

#specify input and output files as dynamic inputs from user in terminal
inFile = sys.argv[1]
outFile = sys.argv[2]

#get data
waterdata = open(inFile,'rU')

#read data lines
dataline = waterdata.readlines()

#define arrays
dates = []
formatDates = []
streamflow = []
strpFlow = []
dummyDateArray = []
ammendedDateList = []
newData = {}
dumData = {}
df = []
dd = []

#close the csv file
waterdata.close()

#parse data - dates must be in first column, flow data must be in last column
for line in dataline:
    parseLine = line.split(";")
    length = len(parseLine)
    date = parseLine[0]
    flow = parseLine[length - 1]
    for j in flow:
        newfl = ''.join([c for c in flow if c in '1234567890.'])            
    dates.append(date)
    streamflow.append(newfl)
stripFlow = [s.rstrip() for s in streamflow[1:]]

#format flow data
flow = [float(x) for x in stripFlow]

#format dates
def date_formatter(string):
    if "/" in string:
        #one way
        dt = dtime.strptime(string, '%m/%d/%Y').strftime('%Y-%m-%d')
    elif "-" in string:
        dt = dtime.strptime(string, '%Y-%m-%d').strftime('%Y-%m-%d')
    elif "," in string:
        dt = dtime.strptime(string, '%B %d, %Y').strftime('%Y-%m-%d')
    return dt

##############
## Functions ###
###############

###Fill in dates with streamflow data between measured data
def days_between(d1, d2):
    d1 = dtime.strptime(d1,'%Y-%m-%d')
    d2 = dtime.strptime(d2, '%Y-%m-%d')
    return abs((d2 - d1).days)

###Create array of dates between two dates with sample
def create_dummy_arrays(date1, date2, flow_start, slope, formatDates, x, flow):
    cutoff = 8
    blank = ""
    dummyDateArray = []
    dummyFlowArray = []
    convdate1= dtime.strptime(date1, '%Y-%m-%d')
    convdate2 = dtime.strptime(date2, '%Y-%m-%d')
    delta = convdate1 - convdate2
    convdelta = int(delta.days)
    if convdelta < cutoff:
        d = 1
        for i in range(convdelta - 1):
            ###dates
            if d < len(range(convdelta)):
                dummydate = convdate2 + datetime.timedelta(days=d)
                stringDummyDate = dummydate.strftime('%Y-%m-%d')
                d = d + 1
                dummyDateArray.append(stringDummyDate)
            ###flows
                y = (slope*(d+1))+flow_start
                y_round = round(y, 2)
                dummyFlowArray.append(y_round)

                formatDates.insert(x, blank)
                flow.insert(x, blank)
                x = x + 1

    return (dummyDateArray, dummyFlowArray, formatDates)

for i in dates[1:]:
    newDate = date_formatter(i)
    formatDates.append(newDate)

#get some statistics for data within certain date range
averageFlow = np.mean(flow) 
sdFlow = np.std(flow)

#some variables
x=1
#overshoot the range guess and account for IndexError
guess = 1000000

try:
    for days in range(guess):
        dpoints = len(formatDates)
        if formatDates[x] != "" and formatDates[x-1] != "":
            d1 = formatDates[x]
            d2 = formatDates[x-1]
            diff = days_between(d1, d2)
            #Fill in data with linear assumptions between data points
            if diff > 1:
                flow1 = flow[x]
                flow2 = flow[x-1]        
        
                #calculate slope between data points
                m = ((flow1 - flow2)/(diff))
        
                #create arrays of new data
                dumDates, dumFlows, formatDates = create_dummy_arrays(d1, d2, flow2, m, formatDates, x, flow)
                for date in dumDates:
                    dd.append(date)
                for f in dumFlows:
                    df.append(f)
                
                dpoints = len(formatDates)
                index = x
            
        #stop counting after getting to the end of the dataset
        if x in range(dpoints):
            x = x + 1
except IndexError:
    pass

dumData = zip(dd, df)

#Fill in empty data entries from original dataset with dates and calculated flows
count = 0
for index, entry in enumerate(formatDates):
    if entry == "":
        formatDates[index] = dumData[count][0]
        count = count + 1

count = 0
for index, f in enumerate(flow):
    if f == "":
        flow[index] = dumData[count][1]
        count = count + 1

allData = zip(formatDates, flow)

with open(outFile, 'wb') as output:
    writer = csv.writer(output, delimiter=" ")
    writer.writerows(allData)
