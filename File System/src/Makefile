
CC ?= gcc
CFLAGS ?= -std=c11 -O2 -Wall -Wextra -Wpedantic

all: test_userfs

userfs.o: userfs.c userfs.h
	$(CC) $(CFLAGS) -c userfs.c -o userfs.o

test_userfs.o: test_userfs.c userfs.h
	$(CC) $(CFLAGS) -c test_userfs.c -o test_userfs.o

test_userfs: userfs.o test_userfs.o
	$(CC) $(CFLAGS) userfs.o test_userfs.o -o test_userfs

clean:
	rm -f userfs.o test_userfs.o test_userfs disk.img
