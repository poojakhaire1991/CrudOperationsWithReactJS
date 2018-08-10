class CustomerList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Customers: [],
            fname: "",
            lname:"",
            address: "",
            id: "",
            fNameErrors: "",
            lNameErrors: "",
            AddressErrors: "",
            fnameisvalid: false,
            lnameisvalid: false,
            addressisvalid: false
        };
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        $.get('/Customers/GetCustomerData', function (data) {
            this.setState({ Customers: data });
        }.bind(this));

    }


    handleEdit(data) {
        this.setState({ id: data.CustomerId, fname: data.FirstName, lname:data.LastName, address: data.Address });
        $("#MyModal").modal('show');
    }

    handleSave(event) {
        if (($("#id").val()) != 0) {
            $.ajax({
                url: '/Customers/UpdateCustomer/',
                data: {
                    CustomerId: this.state.id,
                    FirstName: this.state.fname,
                    LastName: this.state.lname,
                    Address: this.state.address
                },
                success: function (data) {
                    alert("Customer record is updated");
                    window.location.href = '/Customers/Index';
                }
            });
        }
        else {
            $.ajax({
                url: '/Customers/CreateCustomer/',
                data: { FirstName: this.state.fname, LastName: this.state.lname, Address: this.state.address },
                success: function () {
                    alert("Customer is added");
                    window.location.href = '/Customers/Index';
                }
            });
        }
    }

    

    closeModal() {
        window.location.href = '/Customers/Index';
    }


    handleDelete(id) {
        if (!confirm("Do you want to delete customer with Id:" + id)) {
            window.location.href = '/Customers/Index';
        }
        else {
            $.ajax({
                url: '/Customers/DeleteCustomer/' + id,
                success: function (data) {
                    alert("Customer is deleted successfully.");
                    window.location.href = '/Customers/Index';
                }
            })
        }
    }

    onFNameChange(value) {
        this.setState({
            fname: value
        });
    }
    onLNameChange(value) {
        this.setState({
            lname: value
        });
    }
    onAddressChange(value) {
        this.setState({
            address: value
        });        
    }
    isFormValid(event) {
        if (typeof (this.state.fname) !== "undefined") {
            if (!(this.state.fname).match(/^[a-zA-Z]+$/)) {
                this.setState({ fnameisvalid: false, fNameErrors: "Only Letters" });
            }
            else {
                this.setState({ fnameisvalid: true, fNameErrors:"" });
            }
        }
        if (typeof (this.state.lname) !== "undefined") {
            if (!(this.state.lname).match(/^[a-zA-Z]+$/)) {
                this.setState({ lnameisvalid: false, lNameErrors: "Only Letters" });
            }
            else {
                this.setState({ lnameisvalid: true, lNameErrors:"" });
            }
        }
        if (!(this.state.address)) {
            this.setState({ addressisvalid: false, AddressErrors: "Can not be empty" });
        }
        else { this.setState({ addressisvalid: true, AddressErrors:"" }) };

    }
    

    render() {
        return (
            <div>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr><div className="btn btn-primary" data-toggle="modal" data-target="#MyModal">Add New</div></tr>
                        <tr>
                            <th>Customer Id</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Customers.map(data =>
                            <tr key={data.CustomerId} >
                                <td>{data.CustomerId}</td>
                                <td>{data.FirstName}</td>
                                <td>{data.LastName}</td>
                                <td>{data.Address}</td>
                                <td>

                                    <div className="btn btn-warning" onClick={() => this.handleEdit(data)}>Edit</div>
                                    <div className="btn btn-danger" onClick={() => this.handleDelete(data.CustomerId)}>Delete</div>
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
                                        <label htmlFor="FirstName">First Name</label>
                                        <input type="text" className="form-control" onChange={e => this.onFNameChange(e.target.value)} onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="FirstName" id="FirstName" value={this.state.fname}/>
                                        <span style={{ color: "red" }}>{this.state.fNameErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="LastName">Last Name</label>
                                        <input type="text" className="form-control" onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="LastName" id="LastName" value={this.state.lname} onChange={e => this.onLNameChange(e.target.value)} />
                                        <span style={{ color: "red" }}>{this.state.lNameErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Address">Address</label>
                                        <input type="text" className="form-control" onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="Address" id="Address" value={this.state.address} onChange={e => this.onAddressChange(e.target.value)} />
                                        <span style={{ color: "red" }}>{this.state.AddressErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" disabled={!(this.state.fnameisvalid && this.state.lnameisvalid && this.state.addressisvalid)} className="btn btn-primary">Save</button>
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
    <CustomerList />,
    document.getElementById('griddata')
);