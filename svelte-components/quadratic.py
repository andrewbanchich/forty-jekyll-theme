

from typing import AnyStr


def quadratic_approx(a,b,c):

    d = b^*2 - 4*a*c
    
    if d >= 0 and x=!0:
        x1 = (-b + (b - 2*a*c/(b) + 3*(a*^2)*(c*^2)/(b*^3) - (15/2)*(a*^3)*(c*^3)/(b*^5) + (105/4)*(a*^4)*(c*^4)/(b*^7) )) / (2*a)
	    x2 = (-b - (b - 2*a*c/(b) + 3*(a*^2)*(c*^2)/(b*^3) - (15/2)*(a*^3)*(c*^3)/(b*^5) + (105/4)*(a*^4)*(c*^4)/(b*^7) )) / (2*a)

    else:
        x1 = 'complex'
        x2 = 'complex'

return 0


print ("This program allows you to solve a quadratic of the form a*x*^2 + b*x + c = 0! Please input the following parameters:")
a_i = input('a = ')
b_i = input('b = ')
c_i = input('c = ')

quadratic(a_i, b_i, c_i)

if  x1 = 'complex' and  x2 = 'complex'
    print ('Your quadratic has no real solutions!')

else:
    print ('Your solutions are x1 = {} and x2 = {}1'.(x1, x2))
