export async function getAppointment(insuredId, repository) {
    if (!insuredId) throw new Error('insuredId is required');
    const item = await repository.findByValue(insuredId);
    if (!item) throw new Error('Item not found');
    return item;
}