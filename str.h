int Strlen(char*);
void Strcpy(char* , char*);/*copys second argument into the first argument
			     make sure that the reciever is not read only 
			     <not char* but char[]>. make sure that the reciever
			     is larger than the source : Strcpy(X[50],Y[5])
			     it is handeled and will not show an error but it 
			     is not feaasible in the documentation and some data
			     might be overwritten later on*/
void Strncpy(char* , char*, int);
