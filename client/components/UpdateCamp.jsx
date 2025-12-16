const UpdateCamp = ({ data }) => {
    return (
        <form action={`/campgrounds/${data._id}?_method=PATCH`} method="POST" className="needs-validation" noValidate>
            <div className="form-group">
                <label htmlFor="name">Name of campground</label>
                <input type="text" id="name" name="name" defaultValue={data.name} required className="form-control" />
                <div className="invalid-feedback">Name is required.</div>
            </div>
            <div className="form-group">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" name="price" defaultValue={data.price} required className="form-control" />
                <div className="invalid-feedback">Price is required.</div>
            </div>
            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" name="location" defaultValue={data.location} required className="form-control" />
                <div className="invalid-feedback">Location is required.</div>
            </div>
            <div className="form-group">
                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" defaultValue={data.description} required className="form-control" />
                <div className="invalid-feedback">Description is required.</div>
            </div>
            <button type="submit">Update</button>
        </form>
    );
};

export default UpdateCamp;