#include<stdio.h>
#include "str.h"

int main (void)
{
  char x[4];
  char *y = "Aura";

  printf ("Y len : %d\n", Strlen (y));

  Strcpy (x, y);

  printf ("X : %s\n", x);
  return 0;
}
