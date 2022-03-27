#!/usr/bin/env python
# coding: utf-8

# In[1]:


import re
import pandas as pd


# In[2]:


# Password Rules and policies

u = "[A-Z]"
l = "[a-z]"
d = "\d"
s = "\W"


# In[3]:


def passwordValidation(password):
    uc = []
    lc = []
    dc = []
    sc = []
    uc = re.findall(u, password)
    lc = re.findall(l, password)
    dc = re.findall(d, password)
    sc = re.findall(s, password)
    return uc,lc,dc,sc


# In[4]:


with open("data/rockyou.txt", encoding='latin-1') as myfile:
    lines = myfile.readlines()
    rockpass = lines[:4000]


# In[5]:


# Rockyou dataset
strength = []
for i in rockpass:
    uc, lc, dc, sc = passwordValidation(i.strip())
    if(len(uc) != 0 and len(lc) != 0 and len(dc) != 0 and len(sc) != 0):
        strength.append('Strong password')
    elif((len(uc) != 0 and len(lc) != 0) 
            or (len(uc) != 0 and len(dc) != 0) 
            or (len(uc) != 0 and len(sc) != 0) 
            or (len(lc) != 0 and len(dc) != 0) 
            or (len(lc) != 0 and len(sc) != 0) 
            or (len(dc) != 0 and len(sc) != 0) 
            or (len(uc) != 0 and len(lc) != 0 and len(dc) != 0) 
            or (len(uc) != 0 and len(dc) != 0 and len(sc) != 0) 
            or (len(lc) != 0 and len(dc) != 0 and len(sc) != 0)):
        strength.append('Medium password')
    else:
        strength.append('Weak password')


# In[6]:


df = pd.DataFrame()
df['password'] = rockpass
df['APV'] = strength
print(df)


# In[7]:


# 000webhost dataset

webhost = pd.read_csv('data/000webhost.csv', error_bad_lines=False)
webhostpass = webhost['password']
webpass = webhostpass[0:5000]

newstrength = []
for i in webpass:
    uc, lc, dc, sc = passwordValidation(i.strip())
    if(len(uc) != 0 and len(lc) != 0 and len(dc) != 0 and len(sc) != 0):
        newstrength.append('Strong password')
    elif((len(uc) != 0 and len(lc) != 0) 
            or (len(uc) != 0 and len(dc) != 0) 
            or (len(uc) != 0 and len(sc) != 0) 
            or (len(lc) != 0 and len(dc) != 0) 
            or (len(lc) != 0 and len(sc) != 0) 
            or (len(dc) != 0 and len(sc) != 0) 
            or (len(uc) != 0 and len(lc) != 0 and len(dc) != 0) 
            or (len(uc) != 0 and len(dc) != 0 and len(sc) != 0) 
            or (len(lc) != 0 and len(dc) != 0 and len(sc) != 0)):
        newstrength.append('Medium password')
    else:
        newstrength.append('Weak password')
        
df = pd.DataFrame()
df['Password'] = webpass
df['APV'] = newstrength

print(df)


# In[ ]:





# In[ ]:




