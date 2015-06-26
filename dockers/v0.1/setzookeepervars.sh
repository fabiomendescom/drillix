#!/bin/bash

KEY[0]='DRX_AGRP'; 		
VAL[0]='{"awsaccesskey":"AKIAIUAUOG5OVKIGNYWQ","awssecretkey":"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","awsregion":"us-east-1","awsdynamotbl":"drillixauth"}'
KEY[1]='DRX_PGRP_TEST1';
VAL[1]='{"eventtopic":"arn:aws:sns:us-east-1:139086185180:eventtopic","eventqueue":"events","dedupqueue":"dedupevents","dedupqueueurl":"https://sqs.us-east-1.amazonaws.com/139086185180/dedupevents","bucketqueueurl":"https://sqs.us-east-1.amazonaws.com/139086185180/bucketevents","awsaccesskey":"AKIAIUAUOG5OVKIGNYWQ","awssecretkey":"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","awsregion":"us-east-1","awsaccount":"139086185180","mongouser":"heroku_app34960699","mongopassword":"pbho09fpelbpp597c21fu0cami","mongohosts":"ds029197.mongolab.com:29197","mongodb":"heroku_app34960699","mongocollectionpref":"test_"}'

echo "ZOOKEEPER servers being used: $DRX_ZOOKPRSVRS"
ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX root"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX drillix
	echo "DRILLIX root created"
fi

ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/GLOBALVARS)
if [ ! $ZOO ]; then
	echo "Creating DRILLIX/GLOBALVARS service folder"
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/GLOBALVARS globalvars
	echo "/DRILLIX/GLOBALVARS service folder created"
fi


x=0;
for i in ${KEY[@]}; do
	ZOO=$(zookeepercli --servers $DRX_ZOOKPRSVRS -c exists /DRILLIX/GLOBALVARS/$i)
	if [ $ZOO ]; then
		zookeepercli --servers $DRX_ZOOKPRSVRS -c delete /DRILLIX/GLOBALVARS/$i 
	fi
	zookeepercli --servers $DRX_ZOOKPRSVRS -c create /DRILLIX/GLOBALVARS/$i ${VAL[$x]}
	echo "$i registered on /DRILLIX/GLOBALVARS/$i on zookeeper"   
	((x=x+1))     
done



#Auth groups PROD
#export DRX_AGRP_AWSACCKEY=AKIAJGX6GVRKBYFBMFEA
#export DRX_AGRP_AWSSECKEY=9ApLle3zhtln9QjuD2P0iXiCV06KqR9w35DqZAfR
#export DRX_AGRP_AWSREGION=us-west-1
#export DRX_AGRP_AWSACCNT=195410579593
#export DRX_AGRP_DYNAMOTBL=drillixauth

#Process groups PROD
#export DRX_PGRP_PROD1_EVNTSNSTOP=eventtopic
#export DRX_PGRP_PROD1_EVNTQUEUE=events
#export DRX_PGRP_PROD1_AWSACCKEY=AKIAJGX6GVRKBYFBMFEA
#export DRX_PGRP_PROD1_AWSSECKEY=9ApLle3zhtln9QjuD2P0iXiCV06KqR9w35DqZAfR
#export DRX_PGRP_PROD1_AWSREGION=us-west-1
#export DRX_PGRP_PROD1_AWSACCNT=195410579593

#Storage groups PROD
#export DRX_SGRP_TEST1_MONGUSR=heroku_app34960699
#export DRX_SGRP_TEST1_MONPWD=pbho09fpelbpp597c21fu0cami
#export DRX_SGRP_TEST1_MONHOSTS=ds029197.mongolab.com:29197
#export DRX_SGRP_TEST1_MONDB=heroku_app34960699
#export DRX_SGRP_TEST1_MONCOLPREFX=prod_

