#include<stdio.h>
#include "str.h"

int main (int argc , char* argv[])
{
  char x[5];
  char y[] = "10 crazy ass";

  printf ("Y len : %d\n", Strlen (argv[1]));

  Strcpy (x, argv[1]);

  printf ("X len : %d\n", Strlen (x));
  printf ("X : %s\n", x);
  printf ("Y : %s\n", argv[1]);
  return 0;
}
