
#include "userfs.h"
#include <stdio.h>
#include <inttypes.h>
#include <string.h>
#include <errno.h>
int main(void){
  if(ufs_format("debug.img", 32u*1024u*1024u)<0){perror("format");return 1;}
  if(ufs_mount("debug.img")<0){perror("mount1");return 1;}
  if(ufs_mkdir("/docs")<0){perror("mkdir docs");return 1;}
  if(ufs_mkdir("/docs/course")<0){perror("mkdir course");return 1;}
  if(ufs_create("/docs/course/notes.txt")<0){perror("create");return 1;}
  const char *p[]={"/","/docs","/docs/course"};
  for(int k=0;k<3;k++){ struct ufs_dirent e[16]; int n=ufs_listdir(p[k],e,16); printf("%s n=%d err=%d\n",p[k],n,n<0?errno:0); if(n>0) for(int i=0;i<n;i++) printf("  %s id=%" PRIu64 " type=%d\n",e[i].name,e[i].object_id,e[i].type); }
  if(ufs_unmount()<0){perror("unmount1");return 1;}
  if(ufs_mount("debug.img")<0){perror("mount2");return 1;}
  for(int k=0;k<3;k++){ struct ufs_dirent e[16]; int n=ufs_listdir(p[k],e,16); printf("after %s n=%d err=%d\n",p[k],n,n<0?errno:0); if(n>0) for(int i=0;i<n;i++) printf("  %s id=%" PRIu64 " type=%d\n",e[i].name,e[i].object_id,e[i].type); }
  ufs_unmount();
  return 0;
}
