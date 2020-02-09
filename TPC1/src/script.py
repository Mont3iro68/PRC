import csv

with open('data.csv', 'r') as csvfile:
    reader = csv.reader(csvfile, delimiter=',', quotechar="|")
    file = open('Alunos.ttl' ,'a')
    c = 0
    for row in reader:
        if (c != 0):
            file.write("###  http://www.prc.di.uminho.pt/2020/" + row[0].lower() + '\n'
            + ':' + row[0].lower() + ' rdf:type owl:NamedIndividual ,\n' +
                '\t\t:Pessoa ;\n\t:frequenta :prc ;\n\t:Id \"' + row[0].lower() +'\"^^xsd:string ;\n'
            + '\t:curso \"MIEI\"^^xsd:string ;\n' + '\t:email \"' + row[0].lower() 
            + '@alunos.uminho.pt\"^^xsd:string ;\n' + '\t:name \"' + row[1] + '\"^^xsd:string .\n')
        c+=1


