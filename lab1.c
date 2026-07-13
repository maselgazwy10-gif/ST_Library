#include<stdio.h>

void swap(int *ptr_to_x, int * ptr_to_y)
{
	int temp = * ptr_to_x;
	*ptr_to_x = *ptr_to_y;
	*ptr_to_y = temp;
	return;
}

int main(void){
	int a, b;
	a = 10; b = 20;

	printf("Before swap a = %i, b = %i \n", a , b);

	swap(&a , &b);

	printf("After swap a = %i, b = %i \n", a , b);
	return 0;
}
