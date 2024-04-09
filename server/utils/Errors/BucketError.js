function createBucketErrors(err) {
    let errors = { bucketName: '', userId: '' };

    //duplicate error code
    if (err.code === 11000) {
        errors.bucketName = 'Same Bucket Already Exists';
        return errors;
    }

    if (err.message === 'Bucket Name is required') {
        errors.bucketName = 'Please Enter Bucket Name';
    }
    if (err.message === 'User is required') {
        errors.userId = 'Please Authenticate Yourself';
    }


    if (err.message.includes('buckets validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

function addItemErrors(err) {
    let errors = { bucketId: '', userId: '', tmdbId: '' };

    //duplicate error code
    if (err.code === 11000) {
        errors.bucketName = 'File Already Exist in Bucket';
        return errors;
    }

    if (err.message === 'Bucket Id is required') {
        errors.bucketName = 'Please Select Bucket';
    }
    if (err.message === 'User is required') {
        errors.userId = 'Please Authenticate Yourself';
    }
    if (err.message === 'tmdbId is required') {
        errors.tmdbId = 'Please Select File';
    }

    if (err.message.includes('bucketItems validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

function deleteItemErrors(err) {
    let errors = { bucketId: '', userId: '', _id: '' };

    if (err.message === 'Bucket Id is required') {
        errors.bucketName = 'Please Select Bucket';
    }
    if (err.message === 'User is required') {
        errors.userId = 'Please Authenticate Yourself';
    }
    if (err.message === 'ItemId is required') {
        errors._id = 'Please Select File';
    }

    if (err.message.includes('bucketItems validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}


module.exports={createBucketErrors,addItemErrors,deleteItemErrors};