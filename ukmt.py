import math

i = 1
while(True):
    i += 1
    x = i*i*i + 13
    p = True
    for j in range(1,math.floor(x/2)):
        if(x / j == math.floor(x/j)):
            p = False
            break

    if(p):
        print(x)
        break
