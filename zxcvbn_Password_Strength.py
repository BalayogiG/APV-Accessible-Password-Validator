#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
from zxcvbn import zxcvbn
import warnings
warnings.filterwarnings('ignore')


# In[2]:


# Rockyou dataset

with open("data/rockyou.txt", encoding='latin-1') as myfile:
    lines = myfile.readlines()
    rockyoupasswords = lines[:4000]


# In[3]:


# 000webhost dataset

webhost = pd.read_csv('data/000webhost.csv', error_bad_lines=False)
webhostpass = webhost['password']


# In[4]:


webpass = webhostpass[0:4000]
webpass


# In[5]:


strength = []
for p in rockyoupasswords:
    results = zxcvbn(p.strip())

    if(results['score'] == 0):
        strength.append('Worst')
    if(results['score'] == 1):
        strength.append('Weak')
    if(results['score'] == 2):
        strength.append('Medium')
    if(results['score'] == 3):
        strength.append('Good')
    if(results['score'] == 4):
        strength.append('Strong')


df = pd.DataFrame()
df['Password'] = rockyoupasswords
df['zxcvbn'] = strength

print(df)


# In[6]:


newstrength = []
for p in webpass:
    results = zxcvbn(p)

    if(results['score'] == 0):
        newstrength.append('Worst')
    if(results['score'] == 1):
        newstrength.append('Weak')
    if(results['score'] == 2):
        newstrength.append('Medium')
    if(results['score'] == 3):
        newstrength.append('Good')
    if(results['score'] == 4):
        newstrength.append('Strong')


df = pd.DataFrame()
df['Password'] = webpass
df['zxcvbn'] = newstrength

print(df)

