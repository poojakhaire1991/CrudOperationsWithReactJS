class ProductList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Products: [],
            name: "",
            price: "",
            id: "",
            NameErrors: "",
            PriceErrors: "",
            nameisvalid: false,
            priceisvalid: false
        };
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {
        $.get('/Products/GetProductData', function (data) {
            this.setState({ Products: data });
        }.bind(this));

    }


    handleEdit(data) {
        this.setState({ id: data.ProductId, name: data.Name, price: data.Price });
        $("#MyModal").modal('show');
    }

    handleSave(event) {
        if (($("#id").val())!=0) {
            $.ajax({
                url: '/Products/UpdateProduct/',
                data: {
                    ProductId: this.state.id,
                    Name: this.state.name,
                    Price: this.state.price
                },
                success: function (data) {
                    alert("Product record is updated");
                    window.location.href = '/Products/Index';
                }
            });
        }
        else {
            $.ajax({
                url: '/Products/CreateProduct',
                data: { Name: this.state.name, Price: this.state.price },
                success: function () {
                    alert("Product record is added");
                    window.location.href = '/Products/Index';
                }
            });
        }
    }



    closeModal() {
        window.location.href = '/Products/Index';
    }


    handleDelete(id) {
        if (!confirm("Do you want to delete product with Id:" + id)) {
            window.location.href = '/Products/Index';
        }
        else {
            $.ajax({
                url: '/Products/DeleteProduct/' + id,
                success: function (data) {
                    alert("Product is deleted successfully.");
                    window.location.href = '/Products/Index';
                }
            })
        }
    }

    onNameChange(value) {
        this.setState({
            name: value
        });
    }

    onPriceChange(value) {
        this.setState({
            price: value
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
        if (!(this.state.price)) {
            this.setState({ priceisvalid: false, PriceErrors: "Can not be empty" });
        }
        else { this.setState({ priceisvalid: true, PriceErrors: "" }) };

        if (typeof (this.state.price) !== "undefined") {
            if (!(this.state.price).match(/^(0|[1-9][0-9]*)$/)) {
                this.setState({ priceisvalid: false,PriceErrors: "Only Numbers"});
            }
            else {
                this.setState({ priceisvalid: true, PriceErrors: "" });
            }            
        }
    }


    render() {
        return (
            <div>
                <table className="table table-bordered table-responsive">
                    <thead>
                        <tr><div className="btn btn-primary" data-toggle="modal" data-target="#MyModal">Add New</div></tr>
                        <tr>
                            <th>Product Id</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.Products.map(data =>
                            <tr key={data.ProductId} >
                                <td>{data.ProductId}</td>
                                <td>{data.Name}</td>
                                <td>{data.Price}</td>
                                <td>

                                    <div className="btn btn-warning" onClick={() => this.handleEdit(data)}>Edit</div>
                                    <div className="btn btn-danger" onClick={() => this.handleDelete(data.ProductId)}>Delete</div>
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
                                        <label htmlFor="Price">Price</label>
                                        <input type="text" className="form-control" onKeyDown={this.isFormValid.bind(this)} placeholder="The field should not be empty" name="Address" id="Address" value={this.state.price} onChange={e => this.onPriceChange(e.target.value)} />
                                        <span style={{ color: "red" }}>{this.state.PriceErrors}</span>
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" disabled={!(this.state.nameisvalid && this.state.priceisvalid)} className="btn btn-primary">Save</button>
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
    <ProductList />,
    document.getElementById('griddata')
);