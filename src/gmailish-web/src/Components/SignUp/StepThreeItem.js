const StepThreeItem = ({ image, setImage }) => (
  <div className="mb-4">
    <label className="form-label">Upload Profile Image</label>
    <input
      type="file"
      accept="image/*"
      className="form-control form-control-lg"
      onChange={(e) => setImage(e.target.files[0])}
    />
  </div>
);

export default StepThreeItem;