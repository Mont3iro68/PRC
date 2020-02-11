import untangle
import sys


if (len(sys.argv) < 2):
    print ("Falta o nome do ficheiro xml...")

else:
    fout = open("individuals.ttl",'w')
    xml = untangle.parse(sys.argv[1])
    for obra in xml.arquivo_musical.obra:
        instrumentos = []
        partituras = []
        oId = obra['id']
        c = 0
        if('instrumentos' in dir(obra)):
            for instrumento in obra.instrumentos.instrumento:
                
                instId = oId + '-i' + str(c)
                inst = "\n###  http://prc.di.uminho.pt/2020/obras#" + instId
                inst += '\n:' + instId + " rdf:type owl:NamedIndividual ,\n\t:Instrumento ; \n\t"
                
                inst += ':recorre '
                
                p = 0

                for partitura in instrumento.partitura:
                    partId = instId + '-p' + str(p)
                    
                    if ( len(dir(instrumento))-2 == p):
                        inst += ':' + partId + ';\n\t'
                    else:
                        inst += ':' + partId + ',\n\t\t\t '
                    part = '\n###  http://prc.di.uminho.pt/2020/obras#' + partId
                    part += '\n:' + partId + " rdf:type owl:NamedIndividual ,\n\t:Partitura ;\n\t"
                    part += ':path \"' + partitura['path'] + '\"^^xsd:string ;\n\t'
                    if(partitura['voz'] != None):
                        part += ':voz \"' + partitura['voz'] + '\"^^xsd:string ;\n\t'
                        
                    
                    part += ':type \"' + partitura['type'] + '\"^^xsd:string .\n\t'
                    fout.write(part)
                    p+=1


                inst += ':designação \"' + instrumento.designacao.cdata + '\"^^xsd:string .\n'                
                instrumentos.append(inst)  

                c += 1



        ob = "\n###  http://prc.di.uminho.pt/2020/obras#" + oId
        ob += '\n:' + oId + ' rdf:type owl:NamedIndividual ,\n\t:Obra ;\n\t'
        i = 0
        if('instrumentos' in dir(obra)):
            ob += ':utiliza '
        while(i<c):
            fout.write(instrumentos[i])
            if (i==c-1):
                ob +=  ':' + oId + '-i' + str(i) + ' ;\n\t'
            else:
                ob +=  ':' + oId + '-i' + str(i) + ' ,\n\t\t\t '
            i+=1

        if('compositor' in dir(obra)):
            ob += ':compositor \"' + obra.compositor.cdata + '\"^^xsd:string ;\n\t'

        if('tipo' in dir(obra)):
            ob += ':tipo \"' + obra.tipo.cdata + '\"^^xsd:string ;\n\t'

        ob += ':titulo \"' + obra.titulo.cdata + '\"^^xsd:string .\n'

        fout.write(ob)
        
        
                

