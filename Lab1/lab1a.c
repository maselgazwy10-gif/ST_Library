/*
 * lab1a.c
 *
 *  Created on:
 *      Author:
 */

/* include helper functions for game */
#include "lifegame.h"

/* add whatever other includes here */

/* number of generations to evolve the world */
#define NUM_GENERATIONS 50

/* functions to implement */

/* this function should set the state of all
   the cells in the next generation and call
   finalize_evolution() to update the current
   state of the world to the next generation */
void next_generation(void);

/* this function should return the state of the cell
   at (x,y) in the next generation, according to the
   rules of Conway's Game of Life (see handout) */
int get_next_state(int x, int y);

/* this function should calculate the number of alive
   neighbors of the cell at (x,y) */
int num_neighbors(int x, int y);

int main(void)
{
	int n;

	/* TODO: initialize the world */
	FILE* f_file;

	initialize_world_from_file(f_file);
	output_world();

	for (n = 0; n < NUM_GENERATIONS; n++)
		next_generation();

	/* TODO: output final world state */
	output_world();


	return 0;
}

void next_generation(void) {
	/* TODO: for every cell, set the state in the next
	   generation according to the Game of Life rules

	   Hint: use get_next_state(x,y) */
	for(int y = 0; y < get_world_height(); y ++){
		for(int x = 0; x < get_world_width(); x++)
		{
			set_cell_state(x , y , get_next_state(x , y));
		}
}

	finalize_evolution(); /* called at end to finalize */
}

int get_next_state(int x, int y) {
	/* TODO: for the specified cell, compute the state in
	   the next generation using the rules

	   Use num_neighbors(x,y) to compute the number of live
	   neighbors */
	int num = num_neighbors(x , y);
	int is_alive = get_cell_state(x, y);

	if(is_alive)
	{
		if(num ==2 || num == 3)
		{
			return ALIVE;
		}
		else {return DEAD;}
	}
	

	if(!is_alive)
	{
		if(num == 3)
		{
			return ALIVE;
		}
		else {return DEAD;}
	}

}

int num_neighbors(int x, int y) {
	/* TODO: for the specified cell, return the number of
	   neighbors that are ALIVE

	   */
	int width = get_world_width();
	int height = get_world_height();
	int res = 0;
	int neighbor_x = 0, neighbor_y = 0;

	for(int iy = -1; iy < 2; iy++)
	{
		for(int ix = -1; ix < 2; ix++)
		{
			neighbor_x = x + ix;
			neighbor_y = y + iy;

			if(neighbor_x > width || neighbor_x < 0)
			{
				continue;
			}
			if(neighbor_y > height || neighbor_y < 0)
			{
				continue;
			}
			if(ix == 0 && iy == 0)
			{
				continue;
			}
			res += get_cell_state(neighbor_x, neighbor_y);
		}
	}
   return res;
   


}
