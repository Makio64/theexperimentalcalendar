	var threeDimensions = function()
{
	function Edge(a, b)
	{
		this.a = a;
		this.b = b;
	}
	
	function Vector4(x, y, z, t)
	{
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.t = t || 1;
		this.tx = this.ty = this.tz = this.tt = 0;
	}

	function Matrix4()
	{
		this.data = new Float32Array(16);
		this.identity();
	}


	Matrix4.prototype = {

		identity : function()
		{
			var t = this.data;
			t[0] = t[5] = t[10] = t[15] = 1;
			t[1] = t[2] = t[3] = t[4] = t[6] = t[7] = t[8] = t[9] = t[11] = t[12] = t[13] = t[14] = 0;
		},

		transformVector : function(v)
		{
			var t = this.data;
			v.tx = t[0] * v.x + t[1] * v.y + t[2] * v.z + t[3] * v.t;
			v.ty = t[4] * v.x + t[5] * v.y + t[6] * v.z + t[7] * v.t;
			v.tz = t[8] * v.x + t[9] * v.y + t[10] * v.z + t[11] * v.t;
			v.tt = t[12] * v.x + t[13] * v.y + t[14] * v.z + t[15] * v.t;
		},

		appendTransform : function(m)
		{
			var t = m.data;
			this._appendTransform(t[0], t[1], t[2], t[3],
								  t[4], t[5], t[6], t[7],
								  t[8], t[9], t[10], t[11],
								  t[12], t[13], t[14], t[15]);
		},

		scale : function(sx, sy, sz)
		{
			var t = this.data;
			this._appendTransform(sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1);
		},

		translate : function(tx, ty, tz)
		{
			var t = this.data;
			this._appendTransform(1, 0, 0, tx, 0, 1, 0, ty, 0, 0, 1, tz, 0, 0, 0, 1);
		},

		//http://jeux.developpez.com/faq/math/?page=quaternions
		rotate : function(x, y, z, angle)
		{
			angle *= 0.5;
			var sin = Math.sin(angle);

			x *= sin; y *= sin; z *= sin;
			w = Math.cos(angle);

			var len2 = x * x + y * y + z * z + w * w;
			if(len2 == 0) X = len2 = 1;
			var r = 1 / len2;

			var xx = x * x * r, xy = x * y * r;
			var xz = x * z * r, xw = x * w * r;
			var yy = y * y * r, yz = y * z * r;
			var yw = y * w * r;
			var zz = z * z * r, zw = z * w * r;

			var a = 1 - 2 * (yy + zz), b = 2 * (xy + zw), c = 2 * (xz - yw);
			var e = 2 * (xy - zw), f = 1 - 2 * (xx + zz), g = 2 * (yz + xw);
			var i = 2 * (xz + yw), j = 2 * (yz - xw), k = 1 - 2 * (xx + yy);

			var t = this.data;
			var d0 = t[0], d1 = t[1], d2 = t[2], d3 = t[3];
			var d4 = t[4], d5 = t[5], d6 = t[6], d7 = t[7];
			var d8 = t[8], d9 = t[9], d10 = t[10], d11 = t[11];
			var d12 = t[12], d13 = t[13], d14 = t[14], d15 = t[15];


			t[0] = a * d0 + e * d1 + i * d2;
			t[1] = b * d0 + f * d1 + j * d2;
			t[2] = c * d0 + g * d1 + k * d2;

			t[4] = a * d4 + e * d5 + i * d6;
			t[5] = b * d4 + f * d5 + j * d6;
			t[6] = c * d4 + g * d5 + k * d6;

			t[8] = a * d8 + e * d9 + i * d10;
			t[9] = b * d8 + f * d9 + j * d10;
			t[10] = c * d8 + g * d9 + k * d10;

			t[12] = a * d12 + e * d13 + i * d14;
			t[13] = b * d12 + f * d13 + j * d14;
			t[14] = c * d12 + g * d13 + k * d14;
		},

		_appendTransform : function (a, b, c, d, e, f, g, h, i, j , k, l, m, n, o, p)
		{
			var t = this.data;
			var t0 = t[0], t1 = t[1], t2 = t[2], t3 = t[3];
			var t4 = t[4], t5 = t[5], t6 = t[6], t7 = t[7];
			var t8 = t[8], t9 = t[9], t10 = t[10], t11 = t[11];
			var t12 = t[12], t13 = t[13], t14 = t[14], t15 = t[15];

			
			t[0] = a * t0 + b * t4 + c * t8 + d * t12;
			t[1] = a * t1 + b * t5 + c * t9 + d * t13;
			t[2] = a * t2 + b * t6 + c * t10 + d * t14;
			t[3] = a * t3 + b * t7 + c * t11 + d * t15;
			
			t[4] = e * t0 + f * t4 + g * t8 + h * t12;
			t[5] = e * t1 + f * t5 + g * t9 + h * t13;
			t[6] = e * t2 + f * t6 + g * t10 + h * t14;
			t[7] = e * t3 + f * t7 + g * t11 + h * t15;
			
			t[8] = i * t0 + j * t4 + k * t8 + l * t12;
			t[9] = i * t1 + j * t5 + k * t9 + l * t13;
			t[10] = i * t2 + j * t6 + k * t10 + l * t14;
			t[11] = i * t3 + j * t7 + k * t11 + l * t15;
			
			t[12] = m * t0 + n * t4 + o * t8 + p * t12;
			t[13] = m * t1 + n * t5 + o * t9 + p * t13;
			t[14] = m * t2 + n * t6 + o * t10 + p * t14;
			t[15] = m * t3 + n * t7 + o * t11 + p * t15;
			
		},
		
		toString : function()
		{
			var t = this.data;
			var str = "";
			str += t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + "\n";
			str += t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + "\n";
			str += t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + "\n";
			str += t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + "\n";
			return str;
		},

		clone : function()
		{
			var clone = new Matrix4();
			for(var i = 0; i < 16; i++)
				clone.data[i] = this.data[i];
		}
	}

	//http://www.songho.ca/opengl/gl_projectionmatrix.html
	Matrix4.projection = function(fov, aspect, near, far)
	{
		var top = near * Math.tan( fov / 2 );

		var ifn = -1 / (far - near);

		var proj = new Matrix4();
		var t = proj.data;
		t[0] = near / (top * aspect);
		t[5] = near / top;
		t[10] = (far + near) * ifn;
		t[11] = -1;
		t[14] = 2 * near * far * ifn;
		t[15] = 0;
		return proj;
	}

	return {Vector4:Vector4,
			Edge:Edge,
			Matrix4:Matrix4}
}();
