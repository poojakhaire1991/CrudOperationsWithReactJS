class StoreList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Stores: [],
            name: "",
            address: "",
            id: "",
            NameErrors: "",
            AddressErrors: "",
            nameisvalid: false,
            addressisvalid: false
        };
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        $.get('/Stores/GetStoreData', function (data) {
            this.setState({ Stores: data });
        }.bind(this));

    }


    handleEdit(data) {
        this.setState({ id: data.StoreId, name: data.Name, address: data.Address });
        $("#MyModal").modal('show');
    }

    handleSave(event) {
        if (($("#id").val()) != 0) {
            $.ajax({
                url: '/Stores/UpdateStore/',
                data: {
                    StoreId: this.state.id,
                    Name: this.state.name,
                    Address: this.state.address
                },
                success: function (data) {
                    alert("Store record is updated");
                    window.location.href = '/Stores/Index';
                }
            });
        }
        else {
            $.ajax({
                url: '/Stores/CreateStore/',
                data: { Name: this.state.name, Address: this.state.address },
                success: function () {
                    alert("Store record is added");
                    window.location.href = '/Stores/Index';
                }
            });
        }
    }



    closeModal() {
        window.location.href = '/Stores/Index';
    }


    handleDelete(id) {
        if (!confirm("Do you want to delete store with Id:" + id)) {
            window.location.href = '/Stores/Index';
        }
        else {
            $.ajax({
                url: '/Stores/DeleteStore/' + id,
                success: function (data) {
                    alert("Store is deleted successfully.");
                    window.location.href = '/Stores/Index';
                }
            })
        }
    }

    onNameChange(value) {
        this.setState({
            name: value
        });
    }
    
    onAddressChange(value) {
        this.setState({
            address: value
        });
    }
    isFormValid(event) {
        if (typeof (this.state.name) !== "undefined") {
            if (!(this.state.name).match(/^[a-zA-Z]+$/)) {
                this.setState({ nameisvalid: false, NameErrors: "Only Letters" });
            }
            else {
                this.setState({ nameisvalid: true, NameErrors: "" });
            }
        }
        
        if (!(this.state.address)) {
            this.setState({ addressisvalid: false, AddressErrors: "Can not be empty" });
        }
        else { this.setState({ addressisvalid: true, AddressErrors: "" }) };

    }


    render() {
        return (
            <div>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr><div className="btn btn-primary" data-toggle="modal" data-target="#MyModal">Add New</div></tr>
                        <tr>
                            <th>Store Id</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Stores.map(data =>
                            <tr key={data.StoreId} >
                                <td>{data.StoreId}</td>
                                <td>{data.Name}</td>
                                <td>{data.Address}</td>
                                <td>
                                    <div className="btn btn-warning" onClick={() => this.handleEdit(data)}>Edit</div>
                                    <div className="btn btn-danger" onClick={() => this.handleDelete(data.StoreId)}>Delete</div>
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
                                <form className="form-horizontal" onSubmit={this.handleSave} >
                                    <div className="form-group">
                                        <input type="hidden" name="id" id="id" value={this.state.id} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Name">Name</label>
                                        <input type="text" className="form-control" onChange={e => this.onNameChange(e.target.value)} onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="Name" id="Name" value={this.state.name} />
                                        <span style={{ color: "red" }}>{this.state.NameErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Address">Address</label>
                                        <input type="text" className="form-control" onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="Address" id="Address" value={this.state.address} onChange={e => this.onAddressChange(e.target.value)} />
                                        <span style={{ color: "red" }}>{this.state.AddressErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" disabled={!(this.state.nameisvalid && this.state.addressisvalid)} className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-danger" onClick={this.closeModal} data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );

    }
}

ReactDOM.render(
    <StoreList />,
    document.getElementById('griddata')
);