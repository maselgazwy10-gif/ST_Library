#include <stdio.h>

int Strlen (char *x)
{

  int sum = 0;
  for (int i = 0;; i = i + 1)
    {
      if (x[i] == '\0')
	{
	  return sum;
	}
      sum += 1;
    }
}

void Strcpy (char *x, char *y)
{
	int i;
  for (i = 0; i < Strlen (y); i++)
   {
      	x[i] = y[i];
    }
  x[i] = '\0';
  return;
}


void Strncpy (char *x , char* y, int n)
{

	if (n > Strlen(y))
		return Strcpy(x,y);
int i;
for (int i =0 ; i<n ; i++){

x[i] = y[i] ;

}
x[n] = '\0' ;
return ;
}
