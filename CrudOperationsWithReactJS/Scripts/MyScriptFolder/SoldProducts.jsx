class SoldProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SoldProducts: [],
            Customers: [],
            Products: [],
            Stores:[],
            CustomerId: "",
            ProductId: "",
            StoreId:"",
            id: "",
            customernameisvalid: false,
            productnameisvalid: false,
            storenameisvalid: false,
            customernameErrors: "",
            productnameErrors: "",
            storenameErrors: ""
        };
        
    }
    handleDelete(id) {
        if (!(confirm("Do you want to delete this record?"))) {
            window.location.href = "/SoldProducts/Index";
        }
        else {
            $.ajax({
                url: "/SoldProducts/DeleteSoldProduct/",
                data: { Id: id },
                success: function (data) {
                    alert("Records deleted successfully.");
                    window.location.href = "/SoldProducts/Index";
                }
            });
        }
    }

    componentDidMount() {
        $.get('/SoldProducts/GetSoldProductData', function (data) {
            this.setState({ SoldProducts: data });
        }.bind(this));
        $.get('/Customers/GetCustomerData', function (data) {
            this.setState({ Customers: data });
        }.bind(this));
        $.get('/Products/GetProductData', function (data) {
            this.setState({ Products: data });
        }.bind(this));
        $.get('/Stores/GetStoreData', function (data) {
            this.setState({ Stores: data });
        }.bind(this));
    }

    CloseModal() {
        window.location.href = "/SoldProducts/Index";
    }

    onCustomerChange = (e) => {
        this.setState({ CustomerId: e.target.value });
    }

    onProductChange = (e) => {
        this.setState({ ProductId: e.target.value });
    }

    onStoreChange = (e) => {
        this.setState({ StoreId: e.target.value });
    }   

    handleEdit(data) {
        this.setState({ id: data.Id 
        //CustomerId: data.Customer, ProductId: data.Product, StoreId: data.Store
    });
    }

    handleSave() {
        if (($("#id").val()) != 0) {
            $.ajax({
                url: "/SoldProducts/UpdateSoldProduct/",
                data: {
                    Id: this.state.id, CustomerId: this.state.CustomerId, ProductId: this.state.ProductId, StoreId: this.state.StoreId
                },
                success: function (data) {
                    alert("Records updated successfully");
                    window.location.href = "/SoldProducts/Index";
                }
            });
        }
        else {
            $.ajax({
                url: "/SoldProducts/CreateSoldProduct/",
                data: {
                    CustomerId: this.state.CustomerId, ProductId: this.state.ProductId, StoreId: this.state.StoreId
                },
                success: function (data) {
                    alert("Records added.");
                    window.location.href = "/SoldProducts/Index";
                }
            });
        }
    }

    isFormValid() {
        if ((this.state.CustomerId)=="") {
            this.setState({ customernameisvalid: false, customernameErrors: "Select Customer name" });
        }
        else {
            this.setState({ customernameisvalid: true, customernameErrors:"" });
        }
        if ((this.state.StoreId)=="") {
            this.setState({ storenameisvalid: false, storenameErrors: "Select Store name" });
        }
        else {
            this.setState({ storenameisvalid: true, storenameErrors:"" });
        }
        if ((this.state.ProductId)=="") {
            this.setState({ productnameisvalid: false, productnameErrors: "Select Customer name" });
        }
        else {
            this.setState({ productnameisvalid: true, productnameErrors:"" });
        }
    }
   
    render()
    {
        return (
            <div>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr><div className="btn btn-primary" data-toggle="modal" data-target="#MyModal">Add New</div></tr>
                        <tr>
                            <th>Id</th>
                            <th>Customer Id</th>
                            <th>Store Id</th>
                            <th>Products Id</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.SoldProducts.map(data =>
                            <tr key={data.Id} >
                                <td>{data.Id}</td>
                                <td>{data.Customer}</td>
                                <td>{data.Store}</td>
                                <td>{data.Product}</td>
                                <td>
                                    <button className="btn btn-warning" data-toggle="modal" data-target="#MyModal" onClick={() => this.handleEdit(data)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => this.handleDelete(data.Id)}>Delete</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="modal fade" id="MyModal">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>SaveModal</h2>
                                <button type="button" className="close" aria-label="Close" data-dismiss="modal">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form className="form-horizontal">
                                    <div className="form-group">
                                        <input type="hidden" value={this.state.id} name="id" id="id"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Customer">Customer Name</label>
                                        <select className="form-control" onClick={this.isFormValid.bind(this)} onChange={this.onCustomerChange}>
                                            <option>--Select Customer here--</option>
                                            {this.state.Customers.map(data =>
                                                <option key={data.CustomerId} value={data.CustomerId}> {data.FirstName}</option>
                                        )}
                                        </select>
                                        <span style={{ color: "red" }}>{this.state.customernameErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Product">Product Name</label>
                                        <select className="form-control" onClick={this.isFormValid.bind(this)} onChange={this.onProductChange}>
                                            <option>--Select Product here--</option>
                                            {this.state.Products.map(data =>
                                                <option key={data.ProductId} value={data.ProductId}> {data.Name}</option>
                                        )}
                                        </select>
                                        <span style={{ color: "red" }}>{this.state.productnameErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Store">Store Name</label>
                                        <select className="form-control" onClick={this.isFormValid.bind(this)} onChange={this.onStoreChange}>
                                            <option>--Select Store here--</option>
                                            {this.state.Stores.map(data =>
                                                <option key={data.StoreId} value={data.StoreId}> {data.Name}</option>
                                         )}
                                        </select>
                                        <span style={{ color: "red" }}>{this.state.storenameErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <button type="button" disabled={!(this.state.customernameisvalid && this.state.productnameisvalid && this.state.storenameisvalid)} onClick={this.handleSave.bind(this)} className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={this.CloseModal} data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>


                </div>
        );
    }
}

ReactDOM.render(
    <SoldProductList />,
    document.getElementById('griddata')
);