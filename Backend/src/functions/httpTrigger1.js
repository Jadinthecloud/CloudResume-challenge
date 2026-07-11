const { app } = require('@azure/functions');
const { TableClient } = require('@azure/data-tables');

app.http('httpTrigger1', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async () => {

        const client = TableClient.fromConnectionString(
            process.env.COSMOS_CONN,
            'view count data'
        );

        const entity = await client.getEntity(
            'Visitors',
            '1'
        );

        const newCount = parseInt(entity.VisitCount) + 1;

        const updatedEntity = {
            partitionKey: 'Visitors',
            rowKey: '1',
            VisitCount: newCount.toString()
        };

        await client.updateEntity(
            updatedEntity,
            'Replace'
        );

        return {
            jsonBody: {
                count: newCount
            }
        };
    }
});